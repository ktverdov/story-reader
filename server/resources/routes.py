from .stories import LikedStoriesApi, HistoryStoriesApi, RecommendedStoriesApi
from .stories import TopStoriesApi, GetStoryApi
from .stories import SearchApi
from .auth import SignupApi, LoginApi

def initialize_routes(api):
    api.add_resource(LikedStoriesApi, '/api/v1/stories/favorites')
    api.add_resource(HistoryStoriesApi, '/api/v1/stories/history')
    api.add_resource(RecommendedStoriesApi, '/api/v1/stories/recommend')

    api.add_resource(TopStoriesApi, '/api/v1/stories/top')
    api.add_resource(GetStoryApi, '/api/v1/stories/<id>')

    api.add_resource(SearchApi, '/api/v1/stories/search/')

    api.add_resource(SignupApi, '/api/v1/auth/signup')
    api.add_resource(LoginApi, '/api/v1/auth/login')