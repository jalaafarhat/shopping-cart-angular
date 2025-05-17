import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  id: number;
  name: string;
  type: 'shoes' | 'shirts' | 'hats';
  price: number;
  sizes: string[];
  image: string;
}

interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: 'Cowboy Boots Brown',
      type: 'shoes',
      price: 350,
      sizes: ['40', '41', '42', '43', '44', '45'],
      image:
        'https://www.ariat.com/dw/image/v2/AAML_PRD/on/demandware.static/-/Sites-ARIAT/default/dw99300076/images/warm/10042471_3-4_front_warm.jpg?sw=410&sh=410',
    },
    {
      id: 2,
      name: 'Cowboy Boots Black',
      type: 'shoes',
      price: 450,
      sizes: ['40', '41', '42', '43', '44', '45'],
      image:
        'https://capitanboots.com/cdn/shop/files/cmh24007d_houston_ps1_0424.jpg?v=1715183773',
    },
    {
      id: 3,
      name: 'US Cowboy Boots',
      type: 'shoes',
      price: 300,
      sizes: ['40', '41', '42', '43', '44', '45'],
      image:
        'https://i5.walmartimages.com/asr/96651955-9f5c-4c71-911b-69e97e5c6c17.2a81bb2ecd2d56e2fe80b1a6f8f7b742.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
    },
    {
      id: 4,
      name: 'Cowboy Hat Brown',
      type: 'hats',
      price: 120,
      sizes: ['M', 'L', 'XL'],
      image:
        'https://i.etsystatic.com/18153692/r/il/3f78bb/5802074775/il_570xN.5802074775_ea70.jpg',
    },
    {
      id: 5,
      name: 'Cowboy Hat Black',
      type: 'hats',
      price: 70,
      sizes: ['M', 'L', 'XL'],
      image:
        'https://m.media-amazon.com/images/I/71UJVI08rrL._AC_UF350,350_QL80_.jpg',
    },
    {
      id: 6,
      name: 'US Cowboy Hat',
      type: 'hats',
      price: 150,
      sizes: ['M', 'L', 'XL'],
      image:
        'https://www.lindaanderson.com/cdn/shop/products/TX704-CowboyHAT-BB-2.jpg?v=1654619117',
    },

    {
      id: 7,
      name: 'Plaid Cowboy Shirt',
      type: 'shirts',
      price: 145,
      sizes: ['S', 'M', 'L', 'XL'],
      image:
        'https://litb-cgis.rightinthebox.com/images//800x800//202406/bps/product/inc/drtmlq1718862233881.jpg',
    },
    {
      id: 8,
      name: 'Plaid Cowboy Shirt',
      type: 'shirts',
      price: 130,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      image: 'https://m.media-amazon.com/images/I/61IQH416KvL._AC_SL1200_.jpg',
    },
    {
      id: 9,
      name: 'Plaid Cowboy Shirt',
      type: 'shirts',
      price: 175,
      sizes: ['S', 'M', 'L', 'XL'],
      image:
        'https://images.halloweencostumes.ca/products/68054/2-1-179161/mens-western-shirt-alt-5.jpg',
    },
  ];

  filteredProducts: Product[] = [];
  selectedTypes: string[] = [];
  selectedSizes: string[] = [];
  selectedSize: { [key: number]: string } = {};
  selectedQuantity: { [key: number]: number } = {};

  shoeSizes = ['40', '41', '42', '43', '44', '45'];
  shirtSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  cartKey: string = '';

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.filteredProducts = [...this.products]; //creates a copy of this.products
  }
  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('hasSeenAd'); // reset flag on logout
    this.router.navigate(['/login']);
  }

  // Filtering
  toggleType(type: string): void {
    const i = this.selectedTypes.indexOf(type);
    if (i === -1) this.selectedTypes.push(type);
    else this.selectedTypes.splice(i, 1);
    this.applyFilters();
  }

  toggleSize(size: string): void {
    const i = this.selectedSizes.indexOf(size);
    if (i === -1) this.selectedSizes.push(size);
    else this.selectedSizes.splice(i, 1);
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((p) => {
      const typeMatch =
        this.selectedTypes.length === 0 || this.selectedTypes.includes(p.type);
      const sizeMatch =
        this.selectedSizes.length === 0 ||
        p.sizes.some((s) => this.selectedSizes.includes(s));
      return typeMatch && sizeMatch;
    });
  }

  // Add to cart
  addToCart(product: Product, size: string, quantity?: number): void {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user?.email) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartKey = `cart_${user.email}`; //unique cart for every user like the supermarket

    if (!size) {
      alert('Please select a size');
      return;
    }

    let finalQuantity = quantity ?? 1; // default to 1 if undefined

    // Block if quantity is more than 20 or less than 1
    if (finalQuantity > 20 || finalQuantity < 1) {
      alert('Quantity must be 1-20!');
      return;
    }

    const cart: CartItem[] = JSON.parse(
      localStorage.getItem(this.cartKey) || '[]'
    );

    // Find existing item with BOTH product ID and size match
    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += finalQuantity;
    } else {
      cart.push({
        product: { ...product }, // Create copy to prevent reference issues
        size: size,
        quantity: finalQuantity,
      });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    alert('Added to cart');
  }
}
