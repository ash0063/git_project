console.log("ROUTES FILE LOADED:", __filename);
const express = require("express")
const router = express.Router()
const ExpressError = require("../middleware/ExpressError");
const axios = require("axios");
const db = require('../config/db')


router.get("/:username", async (req, res, next) => {
    console.log("Route hit");
    try {
        const { username } = req.params;
         const checkQuery = ` SELECT *
            FROM github_profiles
            WHERE username = ? `;
        console.log("before db check")
        db.query(checkQuery, [username], async (err, results) => {

            if (err) {
                return next(err);
            }

            // Profile already exists
            if (results.length > 0) {

                const profile = results[0];

                return res.status(200).json({
                    success: true,
                    source: "database",
                    data: {
                        username: profile.username,
                        name: profile.name,
                        public_repos: profile.public_repos,
                        followers: profile.followers,
                        following: profile.following,
                        profile_url: profile.profile_url
                    }
                });
            }
        console.log("Fetching from GitHub...");
        const response = await axios.get(
            `https://api.github.com/users/${username}`
        );
        console.log(response.data);

        const user = response.data
        const ratio =
            user.following === 0 ? user.followers : (user.followers / user.following).toFixed(2);
        const query = `INSERT INTO github_profiles (
            github_id,
            username,
            name,
            bio,
            location,
            public_repos,
            followers,
            following,
            profile_url,
            followers_following_ratio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

       const values = [
        user.id,
        user.login,
        user.name,
        user.bio,
        user.location,
        user.public_repos,
        user.followers,
        user.following,
        user.html_url,
        ratio
    ];

        db.query(query, values, (err, result) => {
            if (err){
                if (err.code === "ER_DUP_ENTRY") {
                return next( new ExpressError(409, "Profile already analyzed"));
                }
                 return next(err);
            }

            res.status(201).json({
                success: true,
                message: "Profile stored successfully",
                  data: {
                    username: user.login,
                    name: user.name,
                    public_repos: user.public_repos,
                    followers: user.followers,
                    following: user.following,
                    profile_url: user.html_url
                }
            });
        });
    });
    } catch (err) {
        if (err.response?.status === 404) {
            return next( new ExpressError(404, "GitHub user not found"));
        }
        next(err);
    }
});

router.get('/', (req, res, next) => {

    const query = `
        SELECT username,
               name,
               public_repos,
               followers,
               following,
               profile_url
        FROM github_profiles
    `;

    db.query(query, (err, results) => {

        if (err) {
            return next(
                new ExpressError(500, "Error querying database")
            );
        }

        const data = results.map(profile => ({
            username: profile.username,
            name: profile.name,
            public_repos: profile.public_repos,
            followers: profile.followers,
            following: profile.following,
            profile_url: profile.profile_url
        }));

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    });
});

module.exports = router