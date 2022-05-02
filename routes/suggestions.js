import { Router } from "express";
const router = Router();

import middlewareAuthentication from "../authentication.js";
import { getSuggestions, pushData } from "../controllers/suggestions.con.js";

router.get("/chemicals", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.sprayFertilizer.forEach((element) => {
                dataToReturn.push(element);
            });
            data.fungicide.forEach((element) => {
                dataToReturn.push(element);
            });
            data.insecticide.forEach((element) => {
                dataToReturn.push(element);
            });
            data.organic.forEach((element) => {
                dataToReturn.push(element);
            });
            data.plantGrowthRegulator.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/fertilizers", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.fertilizer.forEach((element) => {
                dataToReturn.push(element);
            });
            data.sprayFertilizer.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/sprayFertilizers", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.sprayFertilizer.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/sprayFungicides", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.fungicide.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });

        });
});

router.get("/sprayInsecticides", middlewareAuthentication, (req, res) => {
    getSuggestions()

        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.insecticide.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })

        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/sprayOrganics", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.organic.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);

        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/sprayPlantGrowthRegulators", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.plantGrowthRegulator.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/irrigationFertilizers", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.fertilizer.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        })
});


router.get("/farmWorks", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.farmWork.forEach((element) => {
                dataToReturn.push(element);
            });

            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/soilWorks", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.soilWork.forEach((element) => {

                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/maintenanceWorks", middlewareAuthentication, (req, res) => {
    getSuggestions()
        .then((data) => {
            console.log(data);
            const dataToReturn = [];
            data.maintenance.forEach((element) => {
                dataToReturn.push(element);
            });
            res.status(200).send(dataToReturn);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});



router.post("/:key", middlewareAuthentication, (req, res) => {
    pushData(req.params.key, req.body.data)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});


export default router;