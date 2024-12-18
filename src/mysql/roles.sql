USE music_realtime;

-- Insert roles
INSERT INTO
    Roles (id, name)
VALUES
    (UUID(), 'Admin'),
    (UUID(), 'Artist'),
    (UUID(), 'User');

-- Insert permissions
INSERT INTO
    Permissions (id, name)
VALUES
    (UUID(), 'MANAGE_USERS'),
    (UUID(), 'MANAGE_MOODS'),
    (UUID(), 'MANAGE_GENRE'),
    (UUID(), 'READ_SONGS'),
    (UUID(), 'CREATE_SONGS'),
    (UUID(), 'UPDATE_SONGS'),
    (UUID(), 'DELETE_SONGS'),
    (UUID(), 'READ_PLAYLISTS'),
    (UUID(), 'CREATE_PLAYLISTS'),
    (UUID(), 'UPDATE_PLAYLISTS'),
    (UUID(), 'DELETE_PLAYLISTS'),
    (UUID(), 'PLAY_SONGS');

-- Get IDs of roles
SET
    @adminRoleId = (
        SELECT
            id
        FROM
            Roles
        WHERE
            name = 'Admin'
    );

SET
    @artistRoleId = (
        SELECT
            id
        FROM
            Roles
        WHERE
            name = 'Artist'
    );

SET
    @userRoleId = (
        SELECT
            id
        FROM
            Roles
        WHERE
            name = 'User'
    );

-- Get IDs of permissions
SET
    @readSongsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'READ_SONGS'
    );

SET
    @createSongsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'CREATE_SONGS'
    );

SET
    @updateSongsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'UPDATE_SONGS'
    );

SET
    @deleteSongsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'DELETE_SONGS'
    );

SET
    @manageUsersPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'MANAGE_USERS'
    );

SET
    @readPlaylistsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'READ_PLAYLISTS'
    );

SET
    @createPlaylistsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'CREATE_PLAYLISTS'
    );

SET
    @updatePlaylistsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'UPDATE_PLAYLISTS'
    );

SET
    @deletePlaylistsPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'DELETE_PLAYLISTS'
    );

SET
    @playSongPermission = (
        SELECT
            id
        FROM
            Permissions
        WHERE
            name = 'PLAY_SONGS'
    );

-- Assign permissions to Admin
INSERT INTO
    Role_Permissions (roleId, permissionId)
VALUES
    (@adminRoleId, @readSongsPermission),
    (@adminRoleId, @createSongsPermission),
    (@adminRoleId, @updateSongsPermission),
    (@adminRoleId, @deleteSongsPermission),
    (@adminRoleId, @manageUsersPermission),
    (@adminRoleId, @readPlaylistsPermission),
    (@adminRoleId, @createPlaylistsPermission),
    (@adminRoleId, @updatePlaylistsPermission),
    (@adminRoleId, @deletePlaylistsPermission),
    (@adminRoleId, @playSongPermission),
    (@adminRoleId, @manageGenresPermission),
    (@adminRoleId, @manageMoodsPermission);

-- Assign permissions to Artist
INSERT INTO
    Role_Permissions (roleId, permissionId)
VALUES
    (@artistRoleId, @readSongsPermission),
    (@artistRoleId, @createSongsPermission),
    (@artistRoleId, @updateSongsPermission),
    (@artistRoleId, @deleteSongsPermission),
    (@artistRoleId, @readPlaylistsPermission),
    (@artistRoleId, @createPlaylistsPermission),
    (@artistRoleId, @updatePlaylistsPermission),
    (@artistRoleId, @deletePlaylistsPermission),
    (@artistRoleId, @playSongPermission),

-- Assign permissions to User
INSERT INTO
    Role_Permissions (roleId, permissionId)
VALUES
    (@userRoleId, @readSongsPermission),
    (@userRoleId, @readPlaylistsPermission),
    (@userRoleId, @createPlaylistsPermission),
    (@userRoleId, @updatePlaylistsPermission),
    (@userRoleId, @deletePlaylistsPermission),
    (@userRoleId, @playSongPermission),
