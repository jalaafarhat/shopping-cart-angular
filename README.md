## 🤠 Cowboy Store – Angular Shopping Cart App

This is a cowboy-themed shopping cart application built with **Angular**. It includes user registration, login, filtering products by type and size, adding items to the cart, and user-specific cart persistence using `localStorage`. The project also features full **end-to-end automation testing with Playwright**.

---

### 📂 Project Structure

```
/src/app
  ├── login
  ├── signup
  ├── home
  ├── products
  └── cart
```

---

### 🚀 How to Run the Project

```bash
# Navigate to the project folder
cd shopping-cart

# Run the development server
ng serve
```

The app will be available at:
➡️ `http://localhost:4200`

---

### ✅ Features

* 🧾 Register & login with form validation
* 👕 Product list with filters (by type and size)
* 🛍️ Add products to cart with quantity & size
* 🧠 Cart persists across sessions for each logged-in user
* 🔐 Routes protected via AuthGuard
* 🧪 End-to-End tests using Playwright
* 📢 Alert messages for invalid input

---

### 🧪 How to Run Automation Tests

```bash
# Install Playwright
npx playwright install

# Run the tests
npx playwright test
```

> ⚠️ **Note:** Make sure the Angular app is running via `ng serve` before running the tests.
> Otherwise, tests will fail to connect to `localhost:4200`.

---

### 📚 Resources That Helped Me

* 🔧 [Installing and starting Playwright automation (YouTube)](https://www.youtube.com/watch?v=Xz6lhEzgI5I)
* 🌐 [Running Playwright tests on `localhost:4200`](https://playwright.dev/docs/test-webserver)
* ✅ [Guide to end-to-end login/signup testing](https://betterstack.com/community/guides/testing/playwright-signup-login/)

---

### 📝 Notes

* Cart is tied to the currently logged-in user's email.
* Alerts will notify users when:

  * No size is selected
  * Quantity is invalid (must be 1–20)
* Authentication protects `/home`, `/products`, and `/cart` routes.

---

### 🛡️ License

MIT – Free to use, modify, and distribute.

---

Let me know if you want to include screenshots, deployment steps, or an example `.env` file.
