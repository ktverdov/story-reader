from flask import Response, request
from flask_jwt_extended import create_access_token
from db import User
from flask_restful import Resource
import datetime


class SignupApi(Resource):
    def post(self):
        body = request.get_json()

        if not User.objects(email=body["email"]):
            if len(body["password"]) >= 6:
                user = User(email=body["email"], 
                            password=body["password"])
                user.hash_password()
                user.save()
                return {'id': str(user.id)}, 200
            return {"error": "Short password"}, 401

        return {"error": "Email was already used!"}, 401


class LoginApi(Resource):
    def post(self):
        body = request.get_json()
        user = User.objects.get(email=body['email'])
        authorized = user.check_password(body['password'])
        if not authorized:
            return {'error': 'Email or password invalid'}, 401

        expires = datetime.timedelta(days=1000)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        return {'token': access_token}, 200
