import http.server
import socketserver
import webbrowser
import os
import sys
import json
import urllib.parse


# Load .env file if present
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
env_file = os.path.join(DIRECTORY, '.env')
if os.path.exists(env_file):
    with open(env_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

PORT = int(os.environ.get('PORT', 8000))


with open(os.path.join(DIRECTORY, 'data', 'products.json'), 'r', encoding='utf-8') as f:
    catalog_data = json.load(f)

products_list = catalog_data.get('products', [])
products_by_handle = {p['handle']: p for p in products_list}

# Build Outterspace Upsells List
upsell_items = []
for idx, p in enumerate(products_list):
    base_var_id = 47945000000000 + (idx * 100) + 1
    price_cents = int(float(p["price"]) * 100)
    img_src = f"/{p['images'][0]}" if p.get('images') else ""
    upsell_items.append({
        "id": 1000 + idx,
        "title": p["title"],
        "price": price_cents,
        "image": img_src,
        "variant": base_var_id,
        "available": True,
        "url": f"/products/{p['handle']}",
        "multi": True
    })

variants_map = {}
for p in products_list:
    p_price_cents = int(float(p.get('price', 0)) * 100)
    for v in p.get('variants', []):
        vid = str(v.get('id'))
        v_price_cents = int(float(v.get('price', p.get('price', 0))) * 100)
        variants_map[vid] = {
            'product': p,
            'size': v.get('title', 'OS'),
            'variant_id': v.get('id'),
            'price': v_price_cents if v_price_cents > 0 else p_price_cents
        }

active_cart = {
    "token": "outterspace_live_cart",
    "note": None,
    "attributes": {},
    "original_total_price": 0,
    "total_price": 0,
    "total_discount": 0,
    "total_weight": 0.0,
    "item_count": 0,
    "items": [],
    "requires_shipping": True,
    "currency": "NGN",
    "items_subtotal_price": 0
}

def recalculate_cart():
    total_cents = 0
    count = 0
    for it in active_cart['items']:
        total_cents += it['price'] * it['quantity']
        count += it['quantity']
    active_cart['item_count'] = count
    active_cart['total_price'] = total_cents
    active_cart['original_total_price'] = total_cents
    active_cart['items_subtotal_price'] = total_cents

class SplyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_HEAD(self):
        return self.do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else ''
        
        # 1. Handle /cart/add.js or /cart/add
        if path in ['/cart/add.js', '/cart/add']:
            data = {}
            if post_body.startswith('{'):
                try: data = json.loads(post_body)
                except: pass
            else:
                parsed_form = urllib.parse.parse_qs(post_body)
                data = {k: v[0] for k, v in parsed_form.items()}

            var_id = None
            qty = 1
            if 'items' in data and isinstance(data['items'], list) and len(data['items']) > 0:
                var_id = data['items'][0].get('id')
                qty = int(data['items'][0].get('quantity', 1))
            elif 'id' in data:
                var_id = data.get('id')
                qty = int(data.get('quantity', 1))

            var_id_str = str(var_id) if var_id is not None else ''
            var_info = variants_map.get(var_id_str)

            if not var_info:
                # Check Referer header (e.g. http://localhost:8000/products/frontier)
                referer = self.headers.get('Referer', '')
                if '/products/' in referer:
                    ref_handle = referer.split('/products/')[-1].split('?')[0].split('/')[0].strip()
                    if ref_handle in products_by_handle:
                        prod = products_by_handle[ref_handle]
                        first_v = prod.get('variants', [{}])[0]
                        var_info = {
                            'product': prod,
                            'size': first_v.get('title', 'M'),
                            'variant_id': first_v.get('id', var_id or 1),
                            'price': int(float(first_v.get('price', prod.get('price', 0))) * 100)
                        }

            if not var_info and len(products_list) > 0:
                p0 = products_list[0]
                var_info = {
                    'product': p0,
                    'size': 'M',
                    'variant_id': p0.get('variants', [{}])[0].get('id', 1),
                    'price': int(float(p0['price']) * 100)
                }

            if var_info:
                prod = var_info['product']
                img_src = prod['images'][0] if prod.get('images') else ""
                if not img_src.startswith('/'):
                    img_src = '/' + img_src
                
                found = False
                for it in active_cart['items']:
                    if str(it['id']) == str(var_info['variant_id']):
                        it['quantity'] += qty
                        it['line_price'] = it['price'] * it['quantity']
                        it['final_line_price'] = it['line_price']
                        found = True
                        break
                if not found:
                    new_item = {
                        "id": var_info['variant_id'],
                        "properties": {},
                        "quantity": qty,
                        "variant_id": var_info['variant_id'],
                        "key": f"{var_info['variant_id']}:1",
                        "title": prod['title'] + " - " + var_info['size'],
                        "price": var_info['price'],
                        "original_price": var_info['price'],
                        "discounted_price": var_info['price'],
                        "line_price": var_info['price'] * qty,
                        "original_line_price": var_info['price'] * qty,
                        "total_discount": 0,
                        "discounts": [],
                        "sku": prod.get('handle', ''),
                        "grams": 500,
                        "vendor": "OUTTERSPACE",
                        "taxable": True,
                        "product_id": prod.get('id', 100001),
                        "product_has_only_default_variant": False,
                        "gift_card": False,
                        "final_price": var_info['price'],
                        "final_line_price": var_info['price'] * qty,
                        "url": f"/products/{prod['handle']}",
                        "featured_image": {
                            "aspect_ratio": 1.0,
                            "alt": prod['title'],
                            "height": 1200,
                            "url": img_src,
                            "width": 1200
                        },
                        "image": img_src,
                        "handle": prod['handle'],
                        "product_type": "COWBOY SERIES",
                        "product_title": prod['title'],
                        "product_description": prod.get('description', ''),
                        "variant_title": f"Size {var_info['size']}",
                        "variant_options": [var_info['size']],
                        "options_with_values": [{"name": "Size", "value": var_info['size']}],
                        "line_level_discount_allocations": []
                    }
                    active_cart['items'].insert(0, new_item)

            recalculate_cart()
            resp_bytes = json.dumps(active_cart).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        # 2. Handle /cart/clear.js
        if path in ['/cart/clear.js', '/cart/clear']:
            active_cart['items'] = []
            recalculate_cart()
            resp_bytes = json.dumps(active_cart).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        # 3. Handle /cart/change.js
        if path in ['/cart/change.js', '/cart/change']:
            data = {}
            if post_body.startswith('{'):
                try: data = json.loads(post_body)
                except: pass
            else:
                parsed_form = urllib.parse.parse_qs(post_body)
                data = {k: v[0] for k, v in parsed_form.items()}

            qty = int(data.get('quantity', 0))
            line_key = str(data.get('id', data.get('line', '')))

            for it in list(active_cart['items']):
                if str(it['id']) == line_key or it.get('key') == line_key:
                    if qty <= 0:
                        active_cart['items'].remove(it)
                    else:
                        it['quantity'] = qty
                        it['line_price'] = it['price'] * qty
                        it['final_line_price'] = it['line_price']
                    break

            recalculate_cart()
            resp_bytes = json.dumps(active_cart).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        return super().do_GET()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        # 1. Handle root /
        if path == '' or path == '/':
            return super().do_GET()

        # 2. Handle /products/<handle> -> /products/<handle>.html
        if path.startswith('/products/'):
            handle = path[len('/products/'):]
            if not handle.endswith('.html'):
                candidate = os.path.join(DIRECTORY, 'products', f"{handle}.html")
                if os.path.exists(candidate):
                    self.path = f"/products/{handle}.html"
                    if parsed.query:
                        self.path += f"?{parsed.query}"
                    return super().do_GET()

        # 3. Handle /collections/rnnr or /collections/home-page-copy
        if path in ['/collections/rnnr', '/collections/home-page-copy']:
            self.path = '/collections/rnnr.html'
            return super().do_GET()

        # 4. Handle /collections/roam or /collections/rnnr-view-copy
        if path in ['/collections/roam', '/collections/rnnr-view-copy']:
            self.path = '/collections/roam.html'
            return super().do_GET()

        # 4b. Handle /collections/a-view
        if path in ['/collections/a-view', '/collections/aview', '/collections/a_view']:
            self.path = '/collections/a-view.html'
            return super().do_GET()

        # 4c. Handle /collections/b or /collections/b-view
        if path in ['/collections/b', '/collections/b-view', '/collections/bview']:
            self.path = '/collections/b.html'
            return super().do_GET()

        # 4d. Handle /collections/c or /collections/c-view
        if path in ['/collections/c', '/collections/c-view', '/collections/cview']:
            self.path = '/collections/c.html'
            return super().do_GET()

        # 5. Handle /collections/all or other collections -> /index.html
        if path.startswith('/collections'):
            self.path = '/index.html'
            return super().do_GET()

        # 6. Handle /checkout and /checkouts
        if path in ['/checkout', '/checkouts', '/cart/checkout']:
            self.path = '/checkout.html'
            return super().do_GET()

        # 7. Handle /cart -> /index.html
        if path == '/cart':
            self.path = '/index.html'
            return super().do_GET()

        # 8. Handle /cart.js
        if path == '/cart.js':
            resp_bytes = json.dumps(active_cart).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        # 9. Handle /recommendations/products.json or /recommendations/products
        if path.startswith('/recommendations/products'):
            resp_bytes = json.dumps({"products": upsell_items}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp_bytes)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        return super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    port = PORT
    for p in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", p), SplyHandler) as httpd:
                print(f"\n=======================================================")
                print(f"  OUTTERSPACE STORE — SPLY STUDIO EXACT REPLICA SERVER")
                print(f"  Running at: http://localhost:{p}")
                print(f"  Press Ctrl+C to stop the server")
                print(f"=======================================================\n")
                if '--no-browser' not in sys.argv:
                    webbrowser.open(f"http://localhost:{p}")
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == '__main__':
    run_server()
