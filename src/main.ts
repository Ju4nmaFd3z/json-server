import './style.css'
import {
  borrarCliente,
  borrarPedido,
  crearCliente,
  crearPedido,
  editarCliente,
  editarPedido,
  getClientes,
  getPedidosDeCliente,
  type Cliente,
  type Pedido,
} from './api'

// API: http://localhost:3000  (clientes 1 → M pedidos, FK: clienteId)

// ---------- Elementos del HTML ----------
const tablaClientes = document.getElementById('tabla-clientes') as HTMLElement
const formCliente = document.getElementById('form-cliente') as HTMLFormElement
const tituloFormCliente = document.getElementById('titulo-form-cliente') as HTMLElement
const clienteNombre = document.getElementById('cliente-nombre') as HTMLInputElement
const clienteCiudad = document.getElementById('cliente-ciudad') as HTMLInputElement

const seccionPedidos = document.getElementById('seccion-pedidos') as HTMLElement
const tituloPedidos = document.getElementById('titulo-pedidos') as HTMLElement
const tablaPedidos = document.getElementById('tabla-pedidos') as HTMLElement
const formPedido = document.getElementById('form-pedido') as HTMLFormElement
const tituloFormPedido = document.getElementById('titulo-form-pedido') as HTMLElement
const pedidoProducto = document.getElementById('pedido-producto') as HTMLInputElement
const pedidoImporte = document.getElementById('pedido-importe') as HTMLInputElement

// ---------- Variables de estado ----------
// Cliente cuyos pedidos estamos viendo (null = ninguno)
let clienteActual: Cliente | null = null
// Id del cliente/pedido que estamos editando (null = estamos creando uno nuevo)
let clienteEditando: number | null = null
let pedidoEditando: number | null = null

// ================= CLIENTES =================

// READ: pide los clientes y dibuja la tabla
async function mostrarClientes() {
  const clientes = await getClientes()
  tablaClientes.innerHTML = ''

  for (const c of clientes) {
    const fila = document.createElement('tr')
    fila.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.ciudad}</td>
      <td>
        <button class="ver">Ver pedidos</button>
        <button class="editar">Editar</button>
        <button class="borrar">Borrar</button>
      </td>`

    fila.querySelector<HTMLElement>('.ver')!.onclick = () => verPedidos(c)
    fila.querySelector<HTMLElement>('.editar')!.onclick = () => rellenarFormCliente(c)
    fila.querySelector<HTMLElement>('.borrar')!.onclick = () => eliminarCliente(c)
    tablaClientes.append(fila)
  }
}

// CREATE o UPDATE al enviar el formulario
formCliente.onsubmit = async evento => {
  evento.preventDefault() // evita que la página se recargue
  const cliente: Cliente = { nombre: clienteNombre.value, ciudad: clienteCiudad.value }

  if (clienteEditando === null) {
    await crearCliente(cliente)
  } else {
    await editarCliente(clienteEditando, cliente)
  }
  limpiarFormCliente()
  mostrarClientes()
}

// Pone los datos del cliente en el formulario para editarlos
function rellenarFormCliente(c: Cliente) {
  clienteEditando = c.id!
  tituloFormCliente.textContent = `Editar cliente #${c.id}`
  clienteNombre.value = c.nombre
  clienteCiudad.value = c.ciudad
}

function limpiarFormCliente() {
  clienteEditando = null
  tituloFormCliente.textContent = 'Nuevo cliente'
  formCliente.reset()
}
document.getElementById('cancelar-cliente')!.onclick = limpiarFormCliente

// DELETE
async function eliminarCliente(c: Cliente) {
  if (!confirm(`¿Borrar a ${c.nombre} y todos sus pedidos?`)) return
  await borrarCliente(c.id!)
  clienteActual = null
  seccionPedidos.hidden = true
  mostrarClientes()
}

// ================= PEDIDOS =================

function verPedidos(c: Cliente) {
  clienteActual = c
  seccionPedidos.hidden = false
  tituloPedidos.textContent = `Pedidos de ${c.nombre}`
  limpiarFormPedido()
  mostrarPedidos()
}

// READ: solo los pedidos del cliente actual
async function mostrarPedidos() {
  const pedidos = await getPedidosDeCliente(clienteActual!.id!)
  tablaPedidos.innerHTML = ''

  for (const p of pedidos) {
    const fila = document.createElement('tr')
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.producto}</td>
      <td>${p.importe} €</td>
      <td>
        <button class="editar">Editar</button>
        <button class="borrar">Borrar</button>
      </td>`

    fila.querySelector<HTMLElement>('.editar')!.onclick = () => rellenarFormPedido(p)
    fila.querySelector<HTMLElement>('.borrar')!.onclick = () => eliminarPedido(p)
    tablaPedidos.append(fila)
  }
}

// CREATE o UPDATE al enviar el formulario
formPedido.onsubmit = async evento => {
  evento.preventDefault()
  const pedido: Pedido = {
    producto: pedidoProducto.value,
    importe: Number(pedidoImporte.value),
    clienteId: clienteActual!.id!, // así el pedido queda ligado a su cliente
  }

  if (pedidoEditando === null) {
    await crearPedido(pedido)
  } else {
    await editarPedido(pedidoEditando, pedido)
  }
  limpiarFormPedido()
  mostrarPedidos()
}

function rellenarFormPedido(p: Pedido) {
  pedidoEditando = p.id!
  tituloFormPedido.textContent = `Editar pedido #${p.id}`
  pedidoProducto.value = p.producto
  pedidoImporte.value = String(p.importe)
}

function limpiarFormPedido() {
  pedidoEditando = null
  tituloFormPedido.textContent = 'Nuevo pedido'
  formPedido.reset()
}
document.getElementById('cancelar-pedido')!.onclick = limpiarFormPedido

// DELETE
async function eliminarPedido(p: Pedido) {
  if (!confirm(`¿Borrar el pedido "${p.producto}"?`)) return
  await borrarPedido(p.id!)
  mostrarPedidos()
}

// Al abrir la página
mostrarClientes()
