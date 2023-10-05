const image = (knexInstance) => (req, res) => {
    const { id } = req.body

    knexInstance('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(result => {
            if (result.length) res.json(result[0].entries)
            else res.status(400).json('some error happened')
        }
        )
        .catch(err => res.status(400).json('some error happened'))
}

const handleAPI = (req, res) => {
    const PAT = '59957ad270a74bb4afc51ff8ccf418a3';
    const USER_ID = 'anastasiia_unicorn';
    const APP_ID = 'facerecof1408';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = req.body.input

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

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => res.status(400).json('unable to work with API'))
}

export {image, handleAPI}