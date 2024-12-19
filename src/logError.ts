export const logErrorToServer = async (errorMessage: string) => {
    try {
        await fetch('https://localhost:44372/api/Home/LogError', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: errorMessage }),
        });
    } catch (error) {
        console.error('Failed to log error to server:', error);
    }
};