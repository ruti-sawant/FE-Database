import { Router } from "express";
const router = Router();

import middlewareAuthentication from "../authentication.js";
import { getSuggestions, pushData } from "../controllers/suggestions.con.js";

//to get all chemicals
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

//to get all fertilizers
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

//to get spray fertilizers
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

//to get spray fungicides
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

//to get spray insecticides
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

//to get organic spray chemicals
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

//to get plant growth regulators sprays
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

//to get irrigation fertilizers
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

//to get farmwork list
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

//to get soilwork list.
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

//to get maintenance list.
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


//to add data into fertilizers in suggestion collections.
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