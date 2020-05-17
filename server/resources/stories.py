from flask import Response, request, jsonify

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from bson.json_util import dumps

from mongoengine.queryset.visitor import Q
from db import Story, User

from webargs import fields
from webargs.flaskparser import use_args, parser

import random


class LikedStoriesApi(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)

        liked_stories = Story.objects(story_id__in=user.liked)

        pipeline = [{"$project": {"story_id": 1, "author": 1, "title": 1, "reading_time_min": 1,
                                    "short_content": {"$substrCP": ["$content", 0, 100] } }}, 
                    {"$project": {"_id": 0}}]
        liked_stories = list(liked_stories.aggregate(pipeline))
        liked_stories = dumps(liked_stories)

        return Response(liked_stories, mimetype="application/json", status=200)

    @jwt_required
    def put(self):
        user_id = get_jwt_identity()
        body = request.get_json()

        if not Story.objects(story_id=body["story_id"]):
            return {"msg": "No story with such id found"}, 404

        user = User.objects.get(id=user_id)
        user.update(push__liked=body["story_id"])
        user.save()
        return '', 200

    @jwt_required
    def delete(self):
        user_id = get_jwt_identity()
        body = request.get_json()

        user = User.objects.get(id=user_id)
        user.update(pull__liked=body["story_id"])
        user.save()

        return '', 200


class HistoryStoriesApi(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity()
        user = User.objects.get(id=user_id)

        history_stories = Story.objects(story_id__in=user.history)

        pipeline = [{"$project": {"story_id": 1, "author": 1, "title": 1, "reading_time_min": 1,
                                    "short_content": {"$substrCP": ["$content", 0, 100] } }}, 
                    {"$project": {"_id": 0}}]
        history_stories = list(history_stories.aggregate(pipeline))
        history_stories = dumps(history_stories)

        return Response(history_stories, mimetype="application/json", status=200)

    @jwt_required
    def put(self):
        user_id = get_jwt_identity()
        body = request.get_json()

        if not Story.objects(story_id=body["story_id"]):
            return {"msg": "No story with such id found"}, 404

        user = User.objects.get(id=user_id)
        user.update(push__history=body["story_id"])
        user.save()
        return '', 200


class RecommendedStoriesApi(Resource):
    @jwt_required
    def get(self):
        n_recommended_stories = random.randint(4, 7)
        stories = Story.objects()
        pipeline = [ {"$sample": {"size": n_recommended_stories}}, 
                        {"$project": {"story_id": 1, "author": 1, "title": 1}}, 
                        {"$project": {"_id": 0}} ]
        recommended_stories = list(stories.aggregate(pipeline))
        recommended_stories = dumps(recommended_stories)

        return Response(recommended_stories, mimetype="application/json", status=200)


class TopStoriesApi(Resource):
    def get(self):
        n_top_stories = random.randint(5, 7)
        stories = Story.objects()
        pipeline = [ {"$sample": {"size": n_top_stories}}, 
                        {"$project": {"story_id": 1, "author": 1, "title": 1}}, 
                        {"$project": {"_id": 0}} ]
        top_stories = list(stories.aggregate(pipeline))
        top_stories = dumps(top_stories)

        return Response(top_stories, mimetype="application/json", status=200)


class GetStoryApi(Resource):
    def get(self, id):
        if not Story.objects(story_id=id):
            return {"msg": "No story with such id found"}, 404
        
        story = Story.objects.get(story_id=id).to_json()
        return Response(story, mimetype="application/json", status=200)


class SearchApi(Resource):
    search_args = {"text": fields.Str(missing=""), 
                    "limit": fields.Int(missing=None)}
    
    @use_args(search_args, location='querystring')
    def get(self, args):
        text_to_search = args["text"]

        if text_to_search != "":
            stories = Story.objects(Q(author__icontains=text_to_search) | \
                                    Q(title__icontains=text_to_search))
            pipeline = [{"$project": {"story_id": 1, "author": 1, "title": 1, "reading_time_min": 1,
                                        "short_content": {"$substrCP": ["$content", 0, 100] } }}, 
                        {"$project": {"_id": 0}}]

            stories = list(stories.aggregate(pipeline))
            stories = dumps(stories)

            return Response(stories, mimetype="application/json", status=200)



        time_limit = args["limit"]
        time_limits = [5, 15, 30, 60]

        if time_limit is not None and \
            time_limit in time_limits:
            
            prev_time_limit = 0
            for t in time_limits:
                if time_limit == t:
                    break
                else:
                    prev_time_limit = t

            stories = Story.objects(reading_time_min__lte=time_limit, 
                                    reading_time_min__gte=prev_time_limit)

            pipeline = [{"$project": {"story_id": 1, "author": 1, "title": 1, "reading_time_min": 1,
                                        "short_content": {"$substrCP": ["$content", 0, 100] } }}, 
                        {"$project": {"_id": 0}}, 
                        {"$sort": { "reading_time_min": -1}}]
            stories = list(stories.aggregate(pipeline))
            stories = dumps(stories)

            return Response(stories, mimetype="application/json", status=200)
        
        return "", 404


@parser.error_handler
def handle_request_parsing_error(err, req, schema, *, error_status_code, error_headers):
    abort(error_status_code, errors=err.messages)