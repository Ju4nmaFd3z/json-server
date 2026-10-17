// Llamadas a JSON-Server. Cada función es una petición HTTP.
const API = 'http://localhost:3000'

// El id es opcional porque al crear uno nuevo todavía no lo tiene
export interface Cliente {
  id?: number
  nombre: string
  ciudad: string
}

export interface Pedido {
  id?: number
  producto: string
  importe: number
  clienteId: number // clave foránea: es el id del cliente dueño del pedido
}

const cabeceras = { 'Content-Type': 'application/json' }

// ---------- CLIENTES ----------

// GET /clientes
export async function getClientes(): Promise<Cliente[]> {
  const respuesta = await fetch(`${API}/clientes`)
  return respuesta.json()
}

// POST /clientes
export async function crearCliente(cliente: Cliente) {
  await fetch(`${API}/clientes`, {
    method: 'POST',
    headers: cabeceras,
    body: JSON.stringify(cliente),
  })
}

// PUT /clientes/1
export async function editarCliente(id: number, cliente: Cliente) {
  await fetch(`${API}/clientes/${id}`, {
    method: 'PUT',
    headers: cabeceras,
    body: JSON.stringify(cliente),
  })
}

// DELETE /clientes/1?_dependent=pedidos  (borra también sus pedidos)
export async function borrarCliente(id: number) {
  await fetch(`${API}/clientes/${id}?_dependent=pedidos`, { method: 'DELETE' })
}

// ---------- PEDIDOS ----------

// GET /pedidos?clienteId=1  (solo los pedidos de ese cliente)
export async function getPedidosDeCliente(clienteId: number): Promise<Pedido[]> {
  const respuesta = await fetch(`${API}/pedidos?clienteId=${clienteId}`)
  return respuesta.json()
}

// POST /pedidos
export async function crearPedido(pedido: Pedido) {
  await fetch(`${API}/pedidos`, {
    method: 'POST',
    headers: cabeceras,
    body: JSON.stringify(pedido),
  })
}

// PUT /pedidos/1
export async function editarPedido(id: number, pedido: Pedido) {
  await fetch(`${API}/pedidos/${id}`, {
    method: 'PUT',
    headers: cabeceras,
    body: JSON.stringify(pedido),
  })
}

// DELETE /pedidos/1
export async function borrarPedido(id: number) {
  await fetch(`${API}/pedidos/${id}`, { method: 'DELETE' })
}
