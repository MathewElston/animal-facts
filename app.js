console.log("localStorageAccess: " + db.checkStorage());
db.loadHistory();
db.loadFavorites();

if (db.history.length === 0) {
    db.DEV_fillDummyHistory(15);
}

if (db.favorites.length === 0) {
    db.DEV_fillDummyFavorites(15);
}

createHistoryBar();
createFavoritesBar();