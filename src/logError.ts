export const logErrorToServer = async (errorMessage: string) => {
    try {
        await fetch('https://flipcardsbc.azurewebsites.net/api/Home/LogError', {
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