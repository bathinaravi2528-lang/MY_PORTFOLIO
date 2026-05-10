import requests

def test_codechef(username):
    url = f"https://www.codechef.com/users/{username}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        html = response.text
        
        rating = "---"
        if 'rating-number">' in html:
            rating = html.split('rating-number">')[1].split('<')[0].strip()
        
        stars = "---"
        if 'rating-star">' in html:
            stars_html = html.split('rating-star">')[1].split('</span>')[0]
            stars = str(stars_html.count('★'))
            if not stars or stars == "0":
                if "★" in stars_html:
                    stars = stars_html.strip()[0]
                    
        print(f"Rating: {rating}")
        print(f"Stars: {stars}")
    except Exception as e:
        print(f"Error: {e}")

test_codechef("ravi_varma25")
