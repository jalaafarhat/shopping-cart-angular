import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  id: number;
  name: string;
  type: string;
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
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  cartKey: string = '';
  constructor(private router: Router) {}
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!user?.email) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartKey = `cart_${user.email}`;

    const cart = localStorage.getItem(this.cartKey);
    if (cart) {
      this.cartItems = JSON.parse(cart).map((item: any) => ({
        ...item,
        quantity: item.quantity > 0 ? item.quantity : 1,
      }));
      this.updateTotal();
    }
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
      return sum + item.product.price * qty;
    }, 0);
  }
  incrementQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.saveCart();
  }

  decrementQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.saveCart();
    }
  }

  saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.updateTotal();
  }
  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('hasSeenAd'); // reset flag on logout
    this.router.navigate(['/login']);
  }
}
