
const placasSatrackV2 = require("./placasStrackV2");

let user = "DIALOG"
let vehicles = [
    {
        "licensePlate": "WFG797",
        "user": "Fernandagalindo",
        "password": "Fernanda1003."
    },
    {
        "licensePlate": "PMW625",
        "user": "Lago256",
        "password": "Andresswq256+"
    },
    {
        "licensePlate": "SET428",
        "user": "Cristian543",
        "password": "Alanasofi@1731"
    },
    {
        "licensePlate": "TPM252",
        "user": "usuariodinamica",
        "password": "MGdinamica25@"
    },
    {
        "licensePlate": "TOP292",
        "user": "juliands",
        "password": "SXE082#J"
    },
    {
        "licensePlate": "SIT300",
        "user": "jghoyos",
        "password": "Valenta1*"
    }
]
const runSatrack = async (user, vehicles) => {
    try {
        for (const vehicle of vehicles) {
            console.log("Iniciando registro del vehiculo => " + vehicle.licensePlate)
            await placasSatrackV2(vehicle, user)
        }
        
    } catch (error) {}
}

runSatrack(user,vehicles)