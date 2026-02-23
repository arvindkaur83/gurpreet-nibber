import os
import time
import feedparser
from flask import Flask, request, jsonify

app = Flask(__name__)

# RSS Feeds (you can add more later)
NEWS_FEEDS = {
    "BBC News": "http://feeds.bbci.co.uk/news/rss.xml",
    "CNN": "http://rss.cnn.com/rss/edition.rss",
    "Reuters": "https://www.reutersagency.com/feed/?best-topics=top-news&post_type=best",
    "NY Times": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
}

# Fixed Author Filter
AUTHOR_NAME = "Gurpreet Singh Nibber"


# Fetch RSS Feeds
def get_feeds():
    all_articles = []

    for source, url in NEWS_FEEDS.items():
        feed = feedparser.parse(url)

        for entry in feed.entries[:10]:
            article = {
                "source": source,
                "title": entry.title,
                "link": entry.link,
                "summary": entry.summary if 'summary' in entry else "",
                "published": entry.published if 'published' in entry else "Unknown Date",
                "published_parsed": entry.get('published_parsed', None),
                "author": entry.get('author', '')  # Capture author if available
            }
            all_articles.append(article)

    # Sort newest first
    sorted_articles = sorted(
        all_articles,
        key=lambda x: x['published_parsed'] if x['published_parsed'] else time.gmtime(0),
        reverse=True
    )

    return sorted_articles


# API Endpoint for Articles Page
@app.route('/api/news')
def api_news():
    search_query = request.args.get('q', '').strip()
    articles = get_feeds()

    # Filter by specific author
    articles = [
        a for a in articles
        if AUTHOR_NAME.lower() in a["author"].lower()
    ]

    # Filter by keyword typed by user
    if search_query:
        articles = [
            a for a in articles
            if search_query.lower() in a["title"].lower()
            or search_query.lower() in a["summary"].lower()
        ]

    return jsonify(articles)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
