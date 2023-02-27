export type TextFieldProps={
    name: string;
    error?: string | null | undefined;
    label?: string;
    description?: string;
    placeholder?: string;
    required?: boolean | string;
    onChange?: (name: string, value: string) => void;
    validate?: (name: string, value: string) => string | null;
    onValidate?: (name: string, error: string | null) => void;
    disabled?: boolean;
}


function Text(){
    return <input
    
    
    
    ></input>
    
    
}

export default Text;