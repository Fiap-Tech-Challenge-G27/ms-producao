from flask import Flask
import jwt
from datetime import datetime, timedelta, timezone
import os

app = Flask(__name__)


@app.post("/auth")
def auth():

    mocked_user = {
        "id": "b7813eea-c11d-43f6-ba61-2b84d725128f",
        "name": "mocked user",
        "email": "user@mock.com",
        "cpf": "28706384340",
    }

    expiration_in = datetime.now(tz=timezone.utc) + timedelta(hours=1)

    access_token = jwt.encode(
        {"data": mocked_user, "ex": expiration_in.timestamp()}, os.environ["JWT_SECRET"]
    )

    return {"access_token": access_token}


if __name__ == "__main__":
    app.run(port=3001, host="0.0.0.0")
