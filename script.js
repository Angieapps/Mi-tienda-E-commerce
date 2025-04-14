const productos = [
  { id: 1, nombre: "Auditoria estrategica de Instagram", precio: 37, categoria: "estrategias", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSWhMasM7zwB3NFWpcrTxuGxad0z01WcDPUVLyfDtKz6f1U1_IlWLAHiqqp6xhqVBD6dw&usqp=CAU" },
  { id: 2, nombre: "Plan de contenido con proposito", precio: 88, categoria: "redes", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-AXawGiWTTeCTuwgBsbW5L1G7a_Xz65X-ClMMdEkTyRu8m4l4mGhn6sqbfxQLwyCN7KY&usqp=CAU" },
  { id: 3, nombre: "Guía visual para instagram o lanzamientos", precio: 50, categoria: "redes", imagen: "https://www.prospectfactory.com.mx/wp-content/uploads/2024/10/publicidad-en-redes-sociales.jpg" },
  { id: 4, nombre: "Mentoria 1:1 ", precio: 100, categoria: "ventas", imagen: "https://www.italiaonline.it/risorse/wp-content/uploads/sites/12/2024/04/storytelling-marketing.jpg" },
  { id: 5, nombre: "Mini curso - Redes sociales que convierten", precio: 75, categoria: "ventas", imagen: "https://destakamarketing.com/wp-content/uploads/2024/03/Social-ads.webp" },
  { id: 6, nombre: "Blooming plan-Tu estrategia digital a medida ", precio:250, categoria: "estrategias", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHyiYBbZssov0dxl0YzubQekl0vuOxQ3FhZA&s" }
];

const carrito = [];

// Obtén el contenedor de los productos y el carrito
const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");

// Función para mostrar los productos
function mostrarProductos(lista) {
  contenedorProductos.innerHTML = "";
  lista.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

// Filtrar productos por categoría
function filtrarPorCategoria() {
  const categoria = document.getElementById("categoria").value;
  if (categoria === "todos") {
    mostrarProductos(productos);
  } else {
    const filtrados = productos.filter(p => p.categoria === categoria);
    mostrarProductos(filtrados);
  }
}

// Agregar productos al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  // Verifica si el producto ya está en el carrito
  const productoExistente = carrito.find(item => item.id === id);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  actualizarCarrito();
}

// Actualizar el carrito con el total y los productos
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad}
      
      <button onclick="eliminarDelCarrito(${item.id})">❌</button>
    `;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;
  });

  totalCarrito.textContent = total.toFixed(2);
  cantidadCarrito.textContent = cantidadTotal;
  contenedorPayPal.style.display = carrito.size > 0 ? "block" : "none";
}

function eliminarDelCarrito(id) {
  if (!carrito.has(id)) return;

  let item = carrito.get(id);
  if (item.cantidad > 1) {
    item.cantidad--;
  } else {
    carrito.delete(id);
  }

  guardarCarrito();
  actualizarCarrito();
}

// Vaciar el carrito
function vaciarCarrito() {
  if (confirm("¿Estás segura de que quieres vaciar el carrito?")) {
    carrito.length = 0;
    actualizarCarrito();
  }
}

// PayPal Smart Button
if (window.paypal) {
  paypal
    .Buttons({
      createOrder: function (data, actions) {
        const total = carrito.reduce(
          (acc, item) => acc + item.precio * item.cantidad, 0
        );
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: total.toFixed(2)
              }
            }
          ]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert(
            `¡Gracias ${details.payer.name.given_name}, tu pago fue exitoso! 📚`
          );
          vaciarCarrito();
        });
      },
      onError: function (err) {
        console.error("Error con PayPal:", err);
        alert("Hubo un problema con el pago. Intenta de nuevo.");
      }
    })
    .render("#paypal-button-container");  // Renderiza el botón de PayPal
}

// Inicializar
filtrarPorCategoria();
