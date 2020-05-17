from mongoengine import *
from flask_bcrypt import generate_password_hash, check_password_hash

connect('story_db', host='localhost', port=27017)


class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, min_length=6)
    liked = ListField(IntField(min_value=0))
    history = ListField(IntField(min_value=0))
    recommended = ListField(IntField(min_value=0))

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Story(Document):
    story_id = IntField(required=True, min_value=0, unique=True)
    title = StringField(required=True, max_length=200)
    author = StringField(required=True, max_length=50)
    content = StringField(required=True)
    reading_time_min = IntField(min_value=1, max_value=60)
    language = StringField(required=True, max_length=10)
