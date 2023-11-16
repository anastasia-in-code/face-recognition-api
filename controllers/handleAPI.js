//controller sends request on outer API that provides AI services
const handleAPI = async (req, res) => {
    if (!req.body.input) return res.status(400).json({error:'URL can not be empty'})

    //Clarifai API credentials and settings
    const PAT = '59957ad270a74bb4afc51ff8ccf418a3';
    const USER_ID = 'anastasiia_unicorn';
    const APP_ID = 'facerecof1408';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = req.body.input

    //request body construction
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    //request meta data construction
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    //request to API
    try {
        const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        const result = await response.json()
        return  res.json(result)
    } catch (error) {
        return res.status(500)
    }

}

export default handleAPI