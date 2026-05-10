import requests

def test_leetcode(username):
    url = "https://leetcode.com/graphql"
    query = """
    query combinedQueries($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        topPercentage
      }
    }
    """
    try:
        response = requests.post(url, json={"query": query, "variables": {"username": username}}, timeout=10)
        data = response.json()
        print(data)
    except Exception as e:
        print(f"Error: {e}")

test_leetcode("ravi_varma25")
