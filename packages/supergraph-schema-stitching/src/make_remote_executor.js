import { fetch } from '@whatwg-node/fetch'
import { print } from 'graphql';

// Builds a remote schema executor function,
// customize any way that you need (auth, headers, etc).
// Expects to receive an object with "document" and "variable" params,
// and asynchronously returns a JSON response from the remote.
export function makeRemoteExecutor(url) {
    return async ({ document, variables }) => {
        const query = typeof document === 'string' ? document : print(document);
        const fetchResult = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        });
        return fetchResult.json();
    };
}