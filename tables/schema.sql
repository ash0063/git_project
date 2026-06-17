USE repo_analysis;

CREATE TABLE github_profiles (
    github_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    public_repos INT,
    followers INT,
    following INT,
    profile_url VARCHAR(500),
    followers_following_ratio DECIMAL(10,2)
);

