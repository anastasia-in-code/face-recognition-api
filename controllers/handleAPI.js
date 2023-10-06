//controller sends request on outer API that provides AI services
const handleAPI = (req, res) => {

    //Clarifai API credentials and settings
    const PAT = process.env.PAT;
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;
    const MODEL_ID = process.env.MODEL_ID;
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
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(400).json('unable to work with API'))
}

export default handleAPI