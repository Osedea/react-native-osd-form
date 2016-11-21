export const validateInput = (input, valueToCheck) => {
    let value = typeof valueToCheck === 'string' ? valueToCheck.trim() : valueToCheck;

    if (typeof valueToCheck === 'object' && valueToCheck.nativeEvent) {
        value = valueToCheck.nativeEvent.text
            ? valueToCheck.nativeEvent.text
            : this.state.value; // On Android, onBlur doesn't give the value of the field
    }

    try {
        let isInputValid = false;
        let error = null;

        if (input.validationFunctions) {
            input.validationFunctions.forEach((validationFunction, index) => {
                /* v This was in case you need other fields of the form to do your validation */
                // if (typeof validationFunction(value) === 'function') {
                //     isInputValid = validationFunction(value)(this.state);
                // } else {
                isInputValid = validationFunction(value);
                // }

                if (!isInputValid) {
                    error = input.validationErrorMessages[index];

                    return false;
                }
            });
        }

        return {
            error,
            value,
        };
    } catch (error) {
        console.error('Error in validation', error.message);

        return {
            error: error.message,
            value,
        };
    }
};

export default validateInput;
