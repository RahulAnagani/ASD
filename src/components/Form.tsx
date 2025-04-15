type FormProps = {
    submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
};

const Form: React.FC<FormProps> = ({ children, submitHandler }) => {
    return (
        <form
            onSubmit={submitHandler} 
            className="bg-white flex flex-col justify-center items-center h-[60%] w-[60%] rounded gap-3 relative"
        >
            {children}
        </form>
    );
};

export default Form;
