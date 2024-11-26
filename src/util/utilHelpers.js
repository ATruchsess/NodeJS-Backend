/* Alexander von Truchseß 26.11.2024
 Provides simple, stateless helper functions.
*/

function isNullOrUndefined(value) {
    return value === null || value === undefined;
}

module.exports = { isNullOrUndefined };