#1 BotPlacasSatrack

Este proyecto es un bot automatizado para registrar placas de vehículos en el sistema de Satrack. A continuación, encontrarás las instrucciones para instalar y ejecutar el bot correctamente.

---

## 🛠️ Requisitos Previos

1. **Instalar Node.js**

   Asegúrate de tener instalada la última versión de Node.js en tu equipo.

   👉 [Descargar](https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi)

   Una vez instalado, verifica su correcta instalación ejecutando en la terminal:

   ```bash
   node -v
   npm -v


## 📦 Instalación

Para instalar las dependencias del proyecto, se debe ubicar en la raíz del repositorio y ejecutar el siguiente comando:

      npm install


Este comando descargará todas las dependencias necesarias especificadas en el archivo `package.json`. Es obligatorio ejecutarlo antes de usar el bot.

---

## ⚙️ Configuración

La configuración se realiza en el archivo `iniciarRegistro.js`, ubicado en la siguiente ruta:

      src/scripts/iniciarRegistro.js


Este archivo contiene dos elementos clave que deben ser modificados por el usuario antes de ejecutar el bot:

### 🚘 Array de vehículos

Dentro del archivo existe un **array** en el cual se deben definir los vehículos que se desean registrar. Cada elemento del array representa un vehículo y debe cumplir con la estructura esperada por el bot.

### 🔐 Usuario

En el mismo archivo se debe proporcionar la información del **usuario** al cual se le compartiran las placas de satrack, el usuario que satrack le dio al cliente 

---

## ▶️ Ejecución

Una vez instalado el proyecto y configurado el archivo `iniciarRegistro.js` con los vehículos y el usuario, se puede ejecutar el bot mediante el siguiente comando desde la raíz del proyecto:

      npm start


El bot iniciará sesión con los datos del vehiculo para asignar la placa al usuario general que pusimos

---

## 🧾 Mensajes de salida y posibles errores

Durante la ejecución, el bot mostrará mensajes por consola para cada vehículo procesado. Estos mensajes permiten entender el resultado de cada intento de registro.

### ✅ Registro exitoso sin asignación

Si el bot muestra únicamente dos líneas con check (`✅`), significa que las credenciales fueron correctas pero el vehículo **no fue asignado**. Esto generalmente ocurre cuando el usuario configurado **no tiene permisos** para compartir la placa:

      ✅ Credenciales Correctas de la Placa WFG797

      ✅ Registro de placa WFG797 Completo


> 🔒 Este caso indica que el sistema permitió el acceso pero no completó la asignación por falta de permisos del usuario para compartir la placa.

---

### ✅ Registro y asignación exitosa

Si se muestran **tres mensajes con check**, el vehículo fue asignado correctamente:

      ✅ Credenciales Correctas de la Placa PMW625

      ✅ Apareció un alert con mensaje: La asignación se realizó correctamente.  Placa PMW625

      ✅ Registro de placa PMW625 Completo


> ✅ Todo el proceso fue exitoso. La placa fue registrada y asignada.

---

### ❌ Error general inesperado

Este error se presenta cuando el sistema de Satrack lanza un mensaje genérico como "Parece que algo salió mal". El bot muestra un mensaje de timeout al esperar un elemento en la interfaz:

      ❌ Error general: page.waitForSelector: Timeout 30000ms exceeded.
      Call log:

      waiting for locator('#tab_nav_menu_Services') to be visible

      Finalizo el proceso de la Placa TPM252


> ⚠️ Este error puede deberse a problemas temporales del sistema, lentitud en la red o errores internos de Satrack.

---

### ❌ Credenciales inválidas

Cuando el usuario o contraseña configurados no son válidos para la placa actual, se muestra el siguiente error:

      ❌ Credenciales Erradas de la Placa TOP292

      Finalizo el proceso de la Placa TOP292


> 🔑 Verificar que el usuario y contraseña del vehiculo esten correctos

---

### ❌ Vehículo sin módulo de terceros

Cuando el vehículo no cuenta con el módulo de terceros necesario en el sistema, el bot lanza el siguiente mensaje:

      ✅ Credenciales Correctas de la Placa CAS344

      ❌ Sin Modulo de terceros en el vehiculo , CAS344
