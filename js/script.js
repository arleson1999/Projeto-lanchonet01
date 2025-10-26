// Global State Management
class LunchControlApp {
  constructor() {
    this.currentUser = null;
    this.currentCompany = "lanchonete-a";
    this.companies = {
      "lanchonete-a": {
        name: "Lanchonete A+Burgers",
        location: "Rua das Flores, 123 - Centro",
        logo: "AB",
        color: "#FF6B35",
      },
      "burger-king": {
        name: "Burger King",
        location: "Av. Paulista, 1000 - Bela Vista",
        logo: "BK",
        color: "#FDB827",
      },
      mcdonalds: {
        name: "McDonald's",
        location: "Rua Augusta, 1500 - Consolação",
        logo: "M",
        color: "#FFCC00",
      },
      subway: {
        name: "Subway",
        location: "Av. Brigadeiro Faria Lima, 3400 - Itaim",
        logo: "S",
        color: "#00A651",
      },
    };
    this.products = [];
    this.orders = [];
    this.users = [];
    this.settings = {
      prepTime: 15,
      deliveryFee: 5.0,
      autoStatus: "manual",
    };
    this.theme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.applyTheme();
    this.populateNavigation();
    this.updateCompanyInfo();
    this.renderDashboard();
    this.renderProducts();
    this.renderOrders();
    this.renderUsers();
    this.renderReports();

    // Demo data
    if (this.products.length === 0) {
      this.generateDemoData();
    }

    // Check authentication
    if (!this.currentUser) {
      this.showModal("login-modal");
    }
  }

  setupEventListeners() {
    // Form validations
    document
      .getElementById("login-form")
      .addEventListener("submit", (e) => this.login(e));
    document
      .getElementById("product-form")
      .addEventListener("submit", (e) => this.saveProduct(e));
    document
      .getElementById("order-form")
      .addEventListener("submit", (e) => this.saveOrder(e));
    document
      .getElementById("user-form")
      .addEventListener("submit", (e) => this.saveUser(e));

    // Real-time updates
    document.addEventListener("input", (e) => {
      if (e.target.closest("#order-items")) {
        this.updateOrderTotal();
      }
    });

    // Company settings
    document
      .getElementById("company-name-input")
      .addEventListener("input", (e) => {
        this.companies[this.currentCompany].name = e.target.value;
        this.updateCompanyInfo();
      });
  }

  // Authentication
  login(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const company = document.getElementById("login-company").value;

    // Demo authentication
    if (email === "admin@demo.com" && password === "senha123" && company) {
      this.currentUser = {
        id: 1,
        name: "João Silva",
        email: email,
        role: "administrador",
        avatar: "JS",
      };
      this.currentCompany = company;
      this.saveData();
      this.updateUIAfterLogin();
      this.showNotification("Login realizado com sucesso!", "success");
      this.closeModal("login-modal");
    } else {
      this.showNotification("Credenciais inválidas!", "error");
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("lunchcontrol-user");
    this.showModal("login-modal");
    this.showNotification("Logout realizado com sucesso!", "success");
  }

  updateUIAfterLogin() {
    document.getElementById("user-avatar").textContent =
      this.currentUser.avatar;
    document.getElementById("user-name").textContent = this.currentUser.name;
    document
      .querySelectorAll(".page")
      .forEach((page) => (page.style.display = "block"));
    this.updateCompanyInfo();
    this.populateProductSelects();
  }

  // Company Management (SaaS)
  updateCompanyInfo() {
    const company = this.companies[this.currentCompany];
    document.getElementById("company-name").textContent = company.name;
    document.getElementById("company-location").textContent = company.location;

    // Update theme color for current company
    document.documentElement.style.setProperty(
      "--primary-color",
      company.color
    );

    // Update logo in header
    const logoIcon = document.querySelector(".logo-icon");
    logoIcon.textContent = company.logo;
    logoIcon.style.background = company.color;
  }

  switchCompany() {
    const companyId = document.getElementById("company-selector").value;
    if (companyId && companyId !== this.currentCompany) {
      this.currentCompany = companyId;
      this.saveData();
      this.updateCompanyInfo();
      this.showNotification(
        `Empresa alterada para: ${this.companies[companyId].name}`,
        "success"
      );
      this.closeModal("company-modal");
      this.refreshDashboard();
    }
  }

  showCompanyModal() {
    document.getElementById("company-selector").value = this.currentCompany;
    this.previewCompany();
    this.showModal("company-modal");
  }

  previewCompany() {
    const companyId = document.getElementById("company-selector").value;
    const preview = document.getElementById("company-preview");
    if (companyId) {
      const company = this.companies[companyId];
      document.getElementById("company-preview-content").innerHTML = `
                        <p><strong>Nome:</strong> ${company.name}</p>
                        <p><strong>Localização:</strong> ${company.location}</p>
                        <p><strong>Cor Principal:</strong> <span style="background: ${company.color}; width: 20px; height: 20px; display: inline-block; border-radius: 50%;"></span> ${company.color}</p>
                    `;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  }

  // Products Management
  generateDemoData() {
    this.products = [
      {
        id: 1,
        name: "Cheeseburger Clássico",
        category: "lanche",
        price: 18.9,
        stock: 50,
        sales: 120,
        description:
          "Hambúrguer de carne bovina com queijo cheddar, alface, tomate e molho especial.",
      },
      {
        id: 2,
        name: "Coca-Cola 350ml",
        category: "bebida",
        price: 5.0,
        stock: 200,
        sales: 300,
        description: "Refrigerante Coca-Cola em lata de 350ml.",
      },
      {
        id: 3,
        name: "Batata Frita Grande",
        category: "acompanhamento",
        price: 12.0,
        stock: 80,
        sales: 95,
        description: "Batata frita crocante com sal fino.",
      },
      {
        id: 4,
        name: "X-Salada",
        category: "lanche",
        price: 22.5,
        stock: 30,
        sales: 85,
        description:
          "Hambúrguer com carne, queijo, presunto, alface, tomate e milho.",
      },
      {
        id: 5,
        name: "Suco de Laranja Natural",
        category: "bebida",
        price: 8.5,
        stock: 40,
        sales: 60,
        description: "Suco natural de laranja fresca.",
      },
      {
        id: 6,
        name: "Sobremesa Cheesecake",
        category: "sobremesa",
        price: 15.9,
        stock: 25,
        sales: 45,
        description: "Delicioso cheesecake com calda de morango.",
      },
    ];

    this.orders = [
      {
        id: 1,
        customer: "Maria Silva",
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
        total: 42.8,
        status: "preparando",
        date: "2024-01-15 14:30",
        notes: "Sem cebola",
      },
      {
        id: 2,
        customer: "Pedro Santos",
        items: [
          { productId: 4, quantity: 1 },
          { productId: 3, quantity: 1 },
        ],
        total: 34.5,
        status: "entregue",
        date: "2024-01-15 15:10",
        notes: "",
      },
      {
        id: 3,
        customer: "Ana Costa",
        items: [
          { productId: 1, quantity: 1 },
          { productId: 5, quantity: 1 },
        ],
        total: 27.4,
        status: "preparando",
        date: "2024-01-15 15:45",
        notes: "Rápido por favor",
      },
      {
        id: 4,
        customer: "Lucas Oliveira",
        items: [{ productId: 6, quantity: 1 }],
        total: 15.9,
        status: "cancelado",
        date: "2024-01-15 16:00",
        notes: "Cliente não compareceu",
      },
      {
        id: 5,
        customer: "Fernanda Lima",
        items: [
          { productId: 2, quantity: 2 },
          { productId: 3, quantity: 1 },
        ],
        total: 22.0,
        status: "entregue",
        date: "2024-01-15 16:30",
        notes: "",
      },
    ];

    this.users = [
      {
        id: 1,
        name: "João Silva",
        email: "admin@demo.com",
        role: "administrador",
        status: "ativo",
        permissions: ["all"],
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "gerente@lanchonete.com",
        role: "gerente",
        status: "ativo",
        permissions: ["products", "orders", "reports"],
      },
      {
        id: 3,
        name: "Carlos Souza",
        email: "atendente@lanchonete.com",
        role: "atendente",
        status: "ativo",
        permissions: ["orders"],
      },
      {
        id: 4,
        name: "Ana Oliveira",
        email: "atendente2@lanchonete.com",
        role: "atendente",
        status: "inativo",
        permissions: ["orders"],
      },
    ];

    this.saveData();
    this.renderAll();
  }

  saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById("product-id").value;
    const product = {
      id: id ? parseInt(id) : Date.now(),
      name: document.getElementById("product-name").value,
      category: document.getElementById("product-category").value,
      price: parseFloat(document.getElementById("product-price").value),
      stock: parseInt(document.getElementById("product-stock").value),
      description: document.getElementById("product-description").value,
      sales: id ? this.products.find((p) => p.id == id).sales : 0,
    };

    if (id) {
      const index = this.products.findIndex((p) => p.id == id);
      this.products[index] = product;
      this.showNotification("Produto atualizado com sucesso!", "success");
    } else {
      this.products.push(product);
      this.showNotification("Produto criado com sucesso!", "success");
    }

    this.saveData();
    this.renderProducts();
    this.populateProductSelects();
    this.closeModal("product-modal");
    this.renderTopProducts();
  }

  showProductModal(mode = "create", productId = null) {
    document.getElementById("product-modal-title").textContent =
      mode === "create" ? "Novo Produto" : "Editar Produto";
    document.getElementById("product-form").reset();

    if (mode === "edit" && productId) {
      const product = this.products.find((p) => p.id == productId);
      if (product) {
        document.getElementById("product-id").value = product.id;
        document.getElementById("product-name").value = product.name;
        document.getElementById("product-category").value = product.category;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-stock").value = product.stock;
        document.getElementById("product-description").value =
          product.description;
      }
    }

    this.showModal("product-modal");
  }

  deleteProduct(productId) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      this.products = this.products.filter((p) => p.id != productId);
      this.saveData();
      this.renderProducts();
      this.showNotification("Produto excluído com sucesso!", "success");
      this.populateProductSelects();
    }
  }

  renderProducts() {
    const tbody = document.querySelector("#products-table tbody");
    tbody.innerHTML = "";

    if (this.products.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="empty-state"><div class="empty-state-icon">🍔</div><p>Nenhum produto cadastrado.</p></td></tr>';
      return;
    }

    this.products.forEach((product) => {
      const categoryIcon =
        {
          lanche: "🍔",
          bebida: "🥤",
          acompanhamento: "🍟",
          sobremesa: "🍰",
        }[product.category] || "📦";

      const row = document.createElement("tr");
      row.innerHTML = `
                        <td>${categoryIcon}</td>
                        <td>${product.name}</td>
                        <td>${
                          product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)
                        }</td>
                        <td>R$ ${product.price.toFixed(2)}</td>
                        <td>${product.stock}</td>
                        <td>${product.sales}</td>
                        <td>
                            <button class="btn btn-secondary btn-small" onclick="app.showProductModal('edit', ${
                              product.id
                            })" title="Editar">
                                <i>✏️</i>
                            </button>
                            <button class="btn btn-danger btn-small" onclick="app.deleteProduct(${
                              product.id
                            })" title="Excluir">
                                <i>🗑️</i>
                            </button>
                        </td>
                    `;
      tbody.appendChild(row);
    });
  }

  // Orders Management
  saveOrder(event) {
    event.preventDefault();
    const orderItems = document.querySelectorAll("#order-items .order-item");
    const items = Array.from(orderItems)
      .map((item) => {
        const select = item.querySelector("select");
        const quantityInput = item.querySelector('input[type="number"]');
        return {
          productId: parseInt(select.value),
          quantity: parseInt(quantityInput.value),
        };
      })
      .filter((item) => item.productId);

    if (items.length === 0) {
      this.showNotification(
        "Adicione pelo menos um item ao pedido!",
        "warning"
      );
      return;
    }

    const order = {
      id: document.getElementById("order-id")
        ? parseInt(document.getElementById("order-id").value)
        : Date.now(),
      customer: document.getElementById("order-customer").value,
      phone: document.getElementById("order-phone").value,
      items: items,
      total: parseFloat(
        document
          .getElementById("order-total-value")
          .textContent.replace("R$ ", "")
          .replace(",", ".")
      ),
      status: "preparando",
      date: new Date().toISOString(),
      notes: document.getElementById("order-notes").value,
    };

    if (document.getElementById("order-id")) {
      const index = this.orders.findIndex((o) => o.id == order.id);
      this.orders[index] = order;
      this.showNotification("Pedido atualizado com sucesso!", "success");
    } else {
      this.orders.unshift(order);
      this.showNotification("Pedido criado com sucesso!", "success");
      // Simulate notification sound
      this.playNotificationSound();
    }

    this.saveData();
    this.renderOrders();
    this.closeModal("order-modal");
    this.refreshDashboard();
  }

  showOrderModal(mode = "create", orderId = null) {
    document.getElementById("order-modal-title").textContent =
      mode === "create" ? "Novo Pedido" : "Editar Pedido";
    document.getElementById("order-form").reset();
    document.getElementById("order-items").innerHTML = `
                    <div class="order-item">
                        <select class="form-select" onchange="app.updateOrderTotal()">
                            <option value="">Selecione um produto</option>
                        </select>
                        <input type="number" class="form-input" min="1" value="1" onchange="app.updateOrderTotal()" style="width: 80px;">
                        <button type="button" class="btn btn-danger btn-small" onclick="app.removeOrderItem(this)">Remover</button>
                    </div>
                `;

    if (mode === "edit" && orderId) {
      const order = this.orders.find((o) => o.id == orderId);
      if (order) {
        document.getElementById("order-id").value = order.id;
        document.getElementById("order-customer").value = order.customer;
        document.getElementById("order-phone").value = order.phone;
        document.getElementById("order-notes").value = order.notes;

        // Populate items
        const itemsContainer = document.getElementById("order-items");
        itemsContainer.innerHTML = "";
        order.items.forEach((item, index) => {
          const product = this.products.find((p) => p.id === item.productId);
          if (product) {
            const itemDiv = document.createElement("div");
            itemDiv.className = "order-item";
            itemDiv.innerHTML = `
                                    <select class="form-select" onchange="app.updateOrderTotal()" value="${
                                      product.id
                                    }">
                                        <option value="">Selecione um produto</option>
                                        ${this.products
                                          .map(
                                            (p) =>
                                              `<option value="${p.id}" ${
                                                p.id === product.id
                                                  ? "selected"
                                                  : ""
                                              }>${
                                                p.name
                                              } - R$ ${p.price.toFixed(
                                                2
                                              )}</option>`
                                          )
                                          .join("")}
                                    </select>
                                    <input type="number" class="form-input" min="1" value="${
                                      item.quantity
                                    }" onchange="app.updateOrderTotal()" style="width: 80px;">
                                    <button type="button" class="btn btn-danger btn-small" onclick="app.removeOrderItem(this)">Remover</button>
                                `;
            itemsContainer.appendChild(itemDiv);
          }
        });

        this.updateOrderTotal();
      }
    } else if (mode === "quick") {
      document.getElementById("order-customer").value = "Cliente Rápido";
      document.getElementById("order-phone").value = "(11) 99999-9999";
    }

    this.populateProductSelects();
    this.showModal("order-modal");
  }

  addOrderItem() {
    const itemsContainer = document.getElementById("order-items");
    const newItem = document.createElement("div");
    newItem.className = "order-item";
    newItem.innerHTML = `
                    <select class="form-select" onchange="app.updateOrderTotal()">
                        <option value="">Selecione um produto</option>
                        ${this.products
                          .map(
                            (product) =>
                              `<option value="${product.id}">${
                                product.name
                              } - R$ ${product.price.toFixed(2)}</option>`
                          )
                          .join("")}
                    </select>
                    <input type="number" class="form-input" min="1" value="1" onchange="app.updateOrderTotal()" style="width: 80px;">
                    <button type="button" class="btn btn-danger btn-small" onclick="app.removeOrderItem(this)">Remover</button>
                `;
    itemsContainer.appendChild(newItem);
    this.updateOrderTotal();
  }

  removeOrderItem(button) {
    button.closest(".order-item").remove();
    this.updateOrderTotal();
  }

  updateOrderTotal() {
    let total = 0;
    const orderItems = document.querySelectorAll("#order-items .order-item");

    orderItems.forEach((item) => {
      const select = item.querySelector("select");
      const quantityInput = item.querySelector('input[type="number"]');
      const productId = parseInt(select.value);
      const quantity = parseInt(quantityInput.value) || 0;

      if (productId && quantity > 0) {
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          total += product.price * quantity;
        }
      }
    });

    document.getElementById("order-total").innerHTML = `Total: R$ ${total
      .toFixed(2)
      .replace(".", ",")}`;
    document.getElementById("order-total-value")
      ? (document.getElementById("order-total-value").textContent =
          total.toFixed(2))
      : null;
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.find((o) => o.id == orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();

      if (status === "entregue") {
        order.items.forEach((item) => {
          const product = this.products.find((p) => p.id === item.productId);
          if (product) {
            product.stock -= item.quantity;
            product.sales += item.quantity;
          }
        });
      }

      this.saveData();
      this.renderOrders();
      this.refreshDashboard();
      this.showNotification(
        `Status do pedido ${orderId} atualizado para: ${status}`,
        "success"
      );
    }
  }

  deleteOrder(orderId) {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      this.orders = this.orders.filter((o) => o.id != orderId);
      this.saveData();
      this.renderOrders();
      this.showNotification("Pedido excluído com sucesso!", "success");
      this.refreshDashboard();
    }
  }

  renderOrders() {
    const tbody = document.querySelector("#orders-table tbody");
    tbody.innerHTML = "";

    if (this.orders.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="empty-state"><div class="empty-state-icon">📋</div><p>Nenhum pedido registrado.</p></td></tr>';
      return;
    }

    this.orders.forEach((order) => {
      const statusClass = {
        preparando: "status-preparing",
        entregue: "status-delivered",
        cancelado: "status-cancelled",
      }[order.status];

      const statusText = {
        preparando: "Em Preparo",
        entregue: "Entregue",
        cancelado: "Cancelado",
      }[order.status];

      const itemCount = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const row = document.createElement("tr");
      row.innerHTML = `
                        <td>#${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${itemCount} item(s)</td>
                        <td>R$ ${order.total.toFixed(2)}</td>
                        <td><span class="status ${statusClass}">${statusText}</span></td>
                        <td>${new Date(order.date).toLocaleString("pt-BR")}</td>
                        <td>
                            ${
                              order.status !== "entregue"
                                ? `
                            <button class="btn btn-success btn-small" onclick="app.updateOrderStatus(${order.id}, 'entregue')" title="Marcar como Entregue">
                                <i>✅</i>
                            </button>
                            `
                                : ""
                            }
                            <button class="btn btn-secondary btn-small" onclick="app.showOrderModal('edit', ${
                              order.id
                            })" title="Editar">
                                <i>✏️</i>
                            </button>
                            <button class="btn btn-danger btn-small" onclick="app.deleteOrder(${
                              order.id
                            })" title="Excluir">
                                <i>🗑️</i>
                            </button>
                        </td>
                    `;
      tbody.appendChild(row);
    });
  }

  // Users Management
  saveUser(event) {
    event.preventDefault();
    const password = document.getElementById("user-password").value;
    const confirmPassword = document.getElementById(
      "user-password-confirm"
    ).value;

    if (password !== confirmPassword) {
      this.showNotification("As senhas não coincidem!", "error");
      return;
    }

    const id = document.getElementById("user-id").value;
    const user = {
      id: id ? parseInt(id) : Date.now(),
      name: document.getElementById("user-name").value,
      email: document.getElementById("user-email").value,
      password: password, // In production, hash this
      role: document.getElementById("user-role").value,
      status: document.getElementById("user-status").value,
      permissions: this.getUserPermissions(
        document.getElementById("user-role").value
      ),
    };

    if (id) {
      const index = this.users.findIndex((u) => u.id == id);
      this.users[index] = user;
      this.showNotification("Usuário atualizado com sucesso!", "success");
    } else {
      this.users.push(user);
      this.showNotification("Usuário criado com sucesso!", "success");
    }

    this.saveData();
    this.renderUsers();
    this.closeModal("user-modal");
  }

  getUserPermissions(role) {
    const permissions = {
      atendente: ["orders"],
      gerente: ["products", "orders", "reports"],
      administrador: ["all"],
    };
    return permissions[role] || [];
  }

  showUserModal(mode = "create", userId = null) {
    document.getElementById("user-modal-title").textContent =
      mode === "create" ? "Novo Usuário" : "Editar Usuário";
    document.getElementById("user-form").reset();

    if (mode === "edit" && userId) {
      const user = this.users.find((u) => u.id == userId);
      if (user) {
        document.getElementById("user-id").value = user.id;
        document.getElementById("user-name").value = user.name;
        document.getElementById("user-email").value = user.email;
        document.getElementById("user-role").value = user.role;
        document.getElementById("user-status").value = user.status;
        // Don't prefill password fields for security
      }
    }

    this.showModal("user-modal");
  }

  deleteUser(userId) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      this.users = this.users.filter((u) => u.id != userId);
      this.saveData();
      this.renderUsers();
      this.showNotification("Usuário excluído com sucesso!", "success");
    }
  }

  renderUsers() {
    const tbody = document.querySelector("#users-table tbody");
    tbody.innerHTML = "";

    if (this.users.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">👥</div><p>Nenhum usuário cadastrado.</p></td></tr>';
      return;
    }

    this.users.forEach((user) => {
      const statusText = user.status === "ativo" ? "Ativo" : "Inativo";
      const statusClass =
        user.status === "ativo" ? "status-delivered" : "status-cancelled";
      const roleIcon =
        {
          atendente: "👨‍💼",
          gerente: "👨‍💼",
          administrador: "👑",
        }[user.role] || "👤";

      const permissionsText = user.permissions.join(", ") || "Nenhuma";
      const row = document.createElement("tr");
      row.innerHTML = `
                        <td>${roleIcon} ${user.name}</td>
                        <td>${user.email}</td>
                        <td>${
                          user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        }</td>
                        <td>${permissionsText}</td>
                        <td><span class="status ${statusClass}">${statusText}</span></td>
                        <td>
                            <button class="btn btn-secondary btn-small" onclick="app.showUserModal('edit', ${
                              user.id
                            })" title="Editar">
                                <i>✏️</i>
                            </button>
                            <button class="btn btn-danger btn-small" onclick="app.deleteUser(${
                              user.id
                            })" title="Excluir">
                                <i>🗑️</i>
                            </button>
                        </td>
                    `;
      tbody.appendChild(row);
    });
  }

  // Dashboard & Reports
  refreshDashboard() {
    this.renderDashboard();
    this.showNotification("Dashboard atualizado!", "success");
  }

  renderDashboard() {
    // Update stats
    const today = new Date();
    const todayOrders = this.orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate.toDateString() === today.toDateString();
    });

    const totalSales = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = todayOrders.length;
    const activeOrders = todayOrders.filter(
      (o) => o.status === "preparando"
    ).length;
    const avgPrepTime =
      totalOrders > 0
        ? Math.round((this.settings.prepTime * totalOrders) / totalOrders)
        : 0;

    document.getElementById(
      "total-sales"
    ).textContent = `R$ ${totalSales.toFixed(2)}`;
    document.getElementById("total-orders").textContent = totalOrders;
    document.getElementById("avg-prep-time").textContent = `${avgPrepTime}min`;
    document.getElementById("active-orders").textContent = activeOrders;

    this.renderTopProducts();
    this.renderSalesChart();
  }

  renderTopProducts() {
    const container = document.getElementById("top-products");
    container.innerHTML = "";

    // Calculate total sales per product
    const productSales = {};
    this.orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = this.products.find((p) => p.id === item.productId);
        if (product) {
          productSales[product.id] =
            (productSales[product.id] || 0) + item.quantity * product.price;
        }
      });
    });

    // Get top 4 products
    const topProducts = this.products
      .map((product) => ({
        ...product,
        totalSales: productSales[product.id] || 0,
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 4);

    if (topProducts.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">📦</div><p>Nenhum dado de vendas disponível.</p></div>';
      return;
    }

    topProducts.forEach((product) => {
      const categoryIcon =
        {
          lanche: "🍔",
          bebida: "🥤",
          acompanhamento: "🍟",
          sobremesa: "🍰",
        }[product.category] || "📦";

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
                        <div class="product-image">${categoryIcon}</div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <div class="product-price">R$ ${product.price.toFixed(
                              2
                            )}</div>
                            <p class="product-description">${product.description.substring(
                              0,
                              80
                            )}${
        product.description.length > 80 ? "..." : ""
      }</p>
                            <div style="margin-top: 0.75rem; font-size: 0.875rem; color: var(--text-secondary);">
                                <span>Vendas: ${product.sales} un.</span> | 
                                <span>Receita: R$ ${(
                                  product.totalSales || 0
                                ).toFixed(2)}</span>
                            </div>
                            <div class="product-actions">
                                <button class="btn btn-primary btn-small" onclick="app.showProductModal('edit', ${
                                  product.id
                                })">
                                    Editar
                                </button>
                            </div>
                        </div>
                    `;
      container.appendChild(card);
    });
  }

  renderSalesChart() {
    const ctx = document.getElementById("sales-chart");
    if (!ctx) return;

    // Clear previous chart
    ctx.style.background = "";

    // Sample data for the last 7 days
    const now = new Date();
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString("pt-BR", { weekday: "short" }));

      const dayOrders = this.orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate.toDateString() === date.toDateString();
      });

      data.push(dayOrders.reduce((sum, order) => sum + order.total, 0));
    }

    // Simple bar chart using Canvas
    const canvas = ctx.getContext("2d");
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;
    const barWidth = (width - padding * 2) / labels.length / 1.2;
    const maxValue = Math.max(...data);

    // Clear canvas
    canvas.clearRect(0, 0, width, height);

    // Draw grid
    canvas.strokeStyle = "rgba(0, 0, 0, 0.1)";
    canvas.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = height - padding - (i / 4) * (height - padding * 2);
      canvas.beginPath();
      canvas.moveTo(padding, y);
      canvas.lineTo(width - padding, y);
      canvas.stroke();

      // Y-axis labels
      canvas.fillStyle = "rgba(0, 0, 0, 0.6)";
      canvas.font = "12px Inter";
      canvas.textAlign = "right";
      canvas.fillText(
        `R$ ${((maxValue * i) / 4).toLocaleString("pt-BR")}`,
        padding - 10,
        y + 4
      );
    }

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - padding * 2);
      const x = padding + index * (barWidth * 1.2) + barWidth * 0.1;
      const y = height - padding - barHeight;

      // Bar
      canvas.fillStyle = "var(--primary-color)";
      canvas.fillRect(x, y, barWidth, barHeight);

      // Value label
      canvas.fillStyle = "white";
      canvas.font = "bold 11px Inter";
      canvas.textAlign = "center";
      canvas.fillText(`R$ ${value.toFixed(0)}`, x + barWidth / 2, y - 5);

      // X-axis labels
      canvas.fillStyle = "rgba(0, 0, 0, 0.7)";
      canvas.font = "11px Inter";
      canvas.textAlign = "center";
      canvas.fillText(labels[index], x + barWidth / 2, height - 10);
    });

    // Border
    canvas.strokeStyle = "rgba(0, 0, 0, 0.2)";
    canvas.strokeRect(
      padding - 1,
      padding - 1,
      width - padding * 2 + 2,
      height - padding * 2 + 2
    );
  }

  renderReports() {
    const period = document.getElementById("report-period").value;
    const type = document.getElementById("report-type").value;

    this.updateReportContent(period, type);
    this.renderReportsChart();
  }

  updateReportContent(period, type) {
    const reportTitle = document.getElementById("report-title");
    const reportContent = document.getElementById("report-content");

    let title = "";
    let content = "";

    const getPeriodOrders = () => {
      const now = new Date();
      switch (period) {
        case "today":
          return this.orders.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate.toDateString() === now.toDateString();
          });
        case "week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return this.orders.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate >= weekStart;
          });
        case "month":
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return this.orders.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate >= monthStart;
          });
        default:
          return this.orders;
      }
    };

    const periodOrders = getPeriodOrders();

    switch (type) {
      case "sales":
        title = `Relatório de Vendas - ${
          period.charAt(0).toUpperCase() + period.slice(1)
        }`;
        const totalRevenue = periodOrders.reduce(
          (sum, order) => sum + order.total,
          0
        );
        const avgOrderValue =
          periodOrders.length > 0
            ? (totalRevenue / periodOrders.length).toFixed(2)
            : 0;
        content = `
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-value">R$ ${totalRevenue.toFixed(
                                      2
                                    )}</div>
                                    <div class="stat-label">Receita Total</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">${
                                      periodOrders.length
                                    }</div>
                                    <div class="stat-label">Total de Pedidos</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">R$ ${avgOrderValue}</div>
                                    <div class="stat-label">Ticket Médio</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">${(
                                      (totalRevenue /
                                        (periodOrders.length || 1)) *
                                      100
                                    ).toFixed(0)}%</div>
                                    <div class="stat-label">Conversão</div>
                                </div>
                            </div>
                            <div style="margin-top: 1.5rem;">
                                <h4>Pedidos por Status:</h4>
                                <ul style="list-style: none; padding: 0;">
                                    ${Object.entries(
                                      periodOrders.reduce((acc, order) => {
                                        acc[order.status] =
                                          (acc[order.status] || 0) + 1;
                                        return acc;
                                      }, {})
                                    )
                                      .map(
                                        ([status, count]) => `
                                        <li style="padding: 0.5rem; border-bottom: 1px solid var(--border);">
                                            ${
                                              status.charAt(0).toUpperCase() +
                                              status.slice(1)
                                            }: ${count} pedidos
                                        </li>
                                    `
                                      )
                                      .join("")}
                                </ul>
                            </div>
                        `;
        break;

      case "products":
        title = `Relatório de Produtos - ${
          period.charAt(0).toUpperCase() + period.slice(1)
        }`;
        const productStats = this.products
          .map((product) => {
            const sales = periodOrders.reduce((sum, order) => {
              const itemSales = order.items.reduce((itemSum, item) => {
                return item.productId === product.id
                  ? itemSum + item.quantity
                  : itemSum;
              }, 0);
              return sum + itemSales;
            }, 0);
            const revenue = sales * product.price;
            return { ...product, sales, revenue };
          })
          .sort((a, b) => b.revenue - a.revenue);

        content = `
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Unidades Vendidas</th>
                                            <th>Receita</th>
                                            <th>Estoque Restante</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${productStats
                                          .map(
                                            (product) => `
                                            <tr>
                                                <td>${product.name}</td>
                                                <td>${product.sales}</td>
                                                <td>R$ ${product.revenue.toFixed(
                                                  2
                                                )}</td>
                                                <td>${product.stock}</td>
                                            </tr>
                                        `
                                          )
                                          .join("")}
                                    </tbody>
                                </table>
                            </div>
                        `;
        break;

      case "orders":
        title = `Relatório de Pedidos - ${
          period.charAt(0).toUpperCase() + period.slice(1)
        }`;
        content = `
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Cliente</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Data/Hora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${periodOrders
                                          .slice(0, 10)
                                          .map((order) => {
                                            const statusClass = {
                                              preparando: "status-preparing",
                                              entregue: "status-delivered",
                                              cancelado: "status-cancelled",
                                            }[order.status];
                                            return `
                                                <tr>
                                                    <td>#${order.id}</td>
                                                    <td>${order.customer}</td>
                                                    <td>R$ ${order.total.toFixed(
                                                      2
                                                    )}</td>
                                                    <td><span class="status ${statusClass}">${
                                              order.status
                                            }</span></td>
                                                    <td>${new Date(
                                                      order.date
                                                    ).toLocaleString(
                                                      "pt-BR"
                                                    )}</td>
                                                </tr>
                                            `;
                                          })
                                          .join("")}
                                    </tbody>
                                </table>
                            </div>
                            ${
                              periodOrders.length > 10
                                ? `<p style="text-align: center; color: var(--text-secondary); margin-top: 1rem;">Mostrando os 10 primeiros de ${periodOrders.length} pedidos...</p>`
                                : ""
                            }
                        `;
        break;

      case "customers":
        title = `Relatório de Clientes - ${
          period.charAt(0).toUpperCase() + period.slice(1)
        }`;
        const customerStats = periodOrders.reduce((acc, order) => {
          if (!acc[order.customer]) {
            acc[order.customer] = {
              orders: 0,
              total: 0,
              phone: order.phone,
            };
          }
          acc[order.customer].orders++;
          acc[order.customer].total += order.total;
          return acc;
        }, {});

        const topCustomers = Object.entries(customerStats)
          .map(([name, stats]) => ({ name, ...stats }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);

        content = `
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Pedidos</th>
                                            <th>Total Gasto</th>
                                            <th>Telefone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${topCustomers
                                          .map(
                                            (customer) => `
                                            <tr>
                                                <td>${customer.name}</td>
                                                <td>${customer.orders}</td>
                                                <td>R$ ${customer.total.toFixed(
                                                  2
                                                )}</td>
                                                <td>${
                                                  customer.phone || "N/I"
                                                }</td>
                                            </tr>
                                        `
                                          )
                                          .join("")}
                                    </tbody>
                                </table>
                            </div>
                            ${
                              periodOrders.length > 0
                                ? `<p style="text-align: center; color: var(--text-secondary); margin-top: 1rem;">Total de clientes únicos: ${
                                    Object.keys(customerStats).length
                                  }</p>`
                                : '<p style="text-align: center; color: var(--text-secondary);">Nenhum cliente registrado no período.</p>'
                            }
                        `;
        break;
    }

    reportTitle.textContent = title;
    reportContent.innerHTML = content;
  }

  renderReportsChart() {
    const ctx = document.getElementById("reports-chart");
    if (!ctx) return;

    const period = document.getElementById("report-period").value;
    const type = document.getElementById("report-type").value;

    const canvas = ctx.getContext("2d");
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;

    canvas.clearRect(0, 0, width, height);

    // Simple pie chart for reports
    if (type === "sales") {
      const statusCounts = this.orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(statusCounts).reduce(
        (sum, count) => sum + count,
        0
      );
      let startAngle = 0;

      Object.entries(statusCounts).forEach(([status, count]) => {
        const sliceAngle = (count / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        const statusColors = {
          preparando: "#F39C12",
          entregue: "#27AE60",
          cancelado: "#E74C3C",
        };

        canvas.beginPath();
        canvas.moveTo(width / 2, height / 2);
        canvas.arc(
          width / 2,
          height / 2,
          Math.min(width, height) / 2 - padding,
          startAngle,
          endAngle
        );
        canvas.closePath();
        canvas.fillStyle = statusColors[status] || "#95A5A6";
        canvas.fill();

        // Label
        const labelAngle = startAngle + sliceAngle / 2;
        const labelX =
          width / 2 +
          (Math.min(width, height) / 2 - padding / 2) * Math.cos(labelAngle);
        const labelY =
          height / 2 +
          (Math.min(width, height) / 2 - padding / 2) * Math.sin(labelAngle);

        canvas.fillStyle = "white";
        canvas.font = "bold 12px Inter";
        canvas.textAlign = "center";
        canvas.fillText(
          `${status}: ${Math.round((count / total) * 100)}%`,
          labelX,
          labelY
        );

        startAngle = endAngle;
      });
    } else {
      // Default bar chart for other types
      canvas.fillStyle = "var(--primary-color)";
      canvas.fillRect(padding, height - padding - 50, width - padding * 2, 50);

      canvas.fillStyle = "white";
      canvas.font = "16px Inter";
      canvas.textAlign = "center";
      canvas.fillText("Gráfico em desenvolvimento", width / 2, height / 2);
    }
  }

  filterReports() {
    const period = document.getElementById("report-period").value;
    const type = document.getElementById("report-type").value;
    this.updateReportContent(period, type);
    this.renderReportsChart();
  }

  exportReport(format = "csv") {
    const period = document.getElementById("report-period").value;
    const type = document.getElementById("report-type").value;

    let csvContent = "";
    let filename = `relatorio_${type}_${period}_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    switch (type) {
      case "sales":
        csvContent = "Tipo de Pedido,Quantidade,Valor Total\n";
        const statusCounts = this.orders.reduce((acc, order) => {
          acc[order.status] = acc[order.status] || { count: 0, total: 0 };
          acc[order.status].count++;
          acc[order.status].total += order.total;
          return acc;
        }, {});

        Object.entries(statusCounts).forEach(([status, stats]) => {
          csvContent += `${status},${stats.count},R$ ${stats.total.toFixed(
            2
          )}\n`;
        });
        break;

      case "products":
        csvContent =
          "Produto,Categoria,Preço,Unidades Vendidas,Receita,Estoque\n";
        this.products.forEach((product) => {
          const sales = this.orders.reduce((sum, order) => {
            return (
              sum +
              order.items.reduce((itemSum, item) => {
                return item.productId === product.id
                  ? itemSum + item.quantity
                  : itemSum;
              }, 0)
            );
          }, 0);
          const revenue = sales * product.price;
          csvContent += `"${product.name}","${
            product.category
          }",R$ ${product.price.toFixed(2)},${sales},R$ ${revenue.toFixed(2)},${
            product.stock
          }\n`;
        });
        break;

      default:
        csvContent = "Relatório em desenvolvimento\n";
    }

    if (format === "csv") {
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      this.showNotification(
        `Relatório exportado como ${format.toUpperCase()}!`,
        "success"
      );
    }
  }

  printReport() {
    window.print();
    this.showNotification("Relatório enviado para impressão!", "success");
  }

  // Settings
  saveCompanySettings() {
    this.companies[this.currentCompany].name =
      document.getElementById("company-name-input").value;
    this.companies[this.currentCompany].cnpj =
      document.getElementById("company-cnpj").value;
    this.companies[this.currentCompany].phone =
      document.getElementById("company-phone").value;
    this.companies[this.currentCompany].address =
      document.getElementById("company-address").value;

    this.saveData();
    this.updateCompanyInfo();
    this.showNotification("Configurações da empresa salvas!", "success");
  }

  saveSystemSettings() {
    this.settings.prepTime = parseInt(
      document.getElementById("prep-time").value
    );
    this.settings.deliveryFee = parseFloat(
      document.getElementById("delivery-fee").value
    );
    this.settings.autoStatus = document.getElementById("auto-status").value;

    this.saveData();
    this.refreshDashboard();
    this.showNotification("Configurações do sistema salvas!", "success");
  }

  // UI Utilities
  populateNavigation() {
    const navContainer = document.getElementById("nav-content");
    const pages = [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "products", label: "Produtos", icon: "🍔" },
      { id: "orders", label: "Pedidos", icon: "📋" },
      { id: "reports", label: "Relatórios", icon: "📈" },
      { id: "users", label: "Usuários", icon: "👥" },
      { id: "settings", label: "Configurações", icon: "⚙️" },
    ];

    navContainer.innerHTML = pages
      .map(
        (page) =>
          `<a href="#" class="nav-link ${
            page.id === "dashboard" ? "active" : ""
          }" onclick="selectPage('${page.id}'); return false;">
                        ${page.icon} ${page.label}
                    </a>`
      )
      .join("");
  }

  populateProductSelects() {
    const selects = document.querySelectorAll(
      "#order-items select, .order-item select"
    );
    selects.forEach((select) => {
      if (!select.hasAttribute("data-populated")) {
        select.innerHTML =
          '<option value="">Selecione um produto</option>' +
          this.products
            .map(
              (product) =>
                `<option value="${product.id}">${
                  product.name
                } - R$ ${product.price.toFixed(2)}</option>`
            )
            .join("");
        select.setAttribute("data-populated", "true");
      }
    });
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme);
    document.getElementById("theme-icon").textContent =
      this.theme === "dark" ? "☀️" : "🌙";
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.theme);
    this.applyTheme();
    this.showNotification(
      `Tema alterado para ${this.theme === "dark" ? "escuro" : "claro"}`,
      "success"
    );
  }

  showModal(modalId) {
    document.getElementById(modalId).classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
    document.body.style.overflow = "";

    // Clear forms
    if (modalId === "product-modal") {
      document.getElementById("product-form").reset();
      document.getElementById("product-id").value = "";
    } else if (modalId === "order-modal") {
      document.getElementById("order-form").reset();
      document.getElementById("order-items").innerHTML = `
                        <div class="order-item">
                            <select class="form-select" onchange="app.updateOrderTotal()">
                                <option value="">Selecione um produto</option>
                            </select>
                            <input type="number" class="form-input" min="1" value="1" onchange="app.updateOrderTotal()" style="width: 80px;">
                            <button type="button" class="btn btn-danger btn-small" onclick="app.removeOrderItem(this)">Remover</button>
                        </div>
                    `;
      this.populateProductSelects();
    } else if (modalId === "user-modal") {
      document.getElementById("user-form").reset();
      document.getElementById("user-id").value = "";
    }
  }

  showNotification(message, type = "success") {
    const container = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.className = `notification ${type} show`;
    notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>${
                          type === "success"
                            ? "✅"
                            : type === "error"
                            ? "❌"
                            : "⚠️"
                        }</span>
                        <span>${message}</span>
                    </div>
                `;

    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  playNotificationSound() {
    // Simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log("Notification sound not supported");
    }
  }

  // Data Persistence
  saveData() {
    const data = {
      currentUser: this.currentUser,
      currentCompany: this.currentCompany,
      products: this.products,
      orders: this.orders,
      users: this.users,
      settings: this.settings,
    };

    localStorage.setItem("lunchcontrol-data", JSON.stringify(data));
    localStorage.setItem("lunchcontrol-user", JSON.stringify(this.currentUser));
  }

  loadData() {
    const savedData = localStorage.getItem("lunchcontrol-data");
    const savedUser = localStorage.getItem("lunchcontrol-user");

    if (savedData) {
      const data = JSON.parse(savedData);
      this.currentUser = data.currentUser;
      this.currentCompany = data.currentCompany || "lanchonete-a";
      this.products = data.products || [];
      this.orders = data.orders || [];
      this.users = data.users || [];
      this.settings = { ...this.settings, ...data.settings };
    }

    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  // Page Navigation
  renderAll() {
    this.renderProducts();
    this.renderOrders();
    this.renderUsers();
    this.renderDashboard();
    this.renderReports();
    this.populateProductSelects();
  }

  changeChartPeriod(period) {
    document.getElementById("report-period").value = period;
    this.filterReports();
    this.showNotification(
      `Gráfico alterado para período: ${period}`,
      "success"
    );
  }
}

// Global app instance
const app = new LunchControlApp();

// Page Navigation
function selectPage(pageId) {
  // Update sidebar
  document
    .querySelectorAll(".sidebar-link")
    .forEach((link) => link.classList.remove("active"));
  event
    ? event.target.closest(".sidebar-link").classList.add("active")
    : document
        .querySelector(`[onclick="selectPage('${pageId}')"]`)
        .classList.add("active");

  // Update main nav
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));
  document
    .querySelector(`[onclick="selectPage('${pageId}')"]`)
    ?.classList.add("active");

  // Show page
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  // Page-specific actions
  if (pageId === "dashboard") {
    app.renderDashboard();
  } else if (pageId === "products") {
    app.renderProducts();
  } else if (pageId === "orders") {
    app.renderOrders();
  } else if (pageId === "reports") {
    app.filterReports();
  } else if (pageId === "users") {
    app.renderUsers();
  }

  // Close mobile menu if open
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenu && mobileMenu.classList.contains("active")) {
    mobileMenu.classList.remove("active");
  }
}

function toggleUserMenu() {
  // Simple dropdown functionality
  const userMenu = document.querySelector(".user-menu");
  userMenu.classList.toggle("active");
}

function closeAllModals() {
  document.querySelectorAll(".modal.active").forEach((modal) => {
    modal.classList.remove("active");
  });
  document.body.style.overflow = "";
}

// Close modals on outside click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeAllModals();
  }
});

// Close modals with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllModals();
  }
});

// Prevent body scroll when modal is open
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("login-modal").classList.contains("active")) {
    document.body.style.overflow = "hidden";
  }
});

// Auto-save every 30 seconds
setInterval(() => {
  if (app.currentUser) {
    app.saveData();
  }
}, 30000);

// Real-time order notifications (demo)
setInterval(() => {
  if (app.currentUser && Math.random() < 0.1) {
    // 10% chance every minute
    app.showNotification("Novo pedido recebido! #127", "warning");
    app.playNotificationSound();
  }
}, 60000);

// Initialize charts on load
document.addEventListener("DOMContentLoaded", () => {
  // Resize canvas on window resize
  window.addEventListener("resize", () => {
    app.renderSalesChart();
    app.renderReportsChart();
  });

  // Set canvas sizes
  const canvases = document.querySelectorAll("canvas");
  canvases.forEach((canvas) => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
});
