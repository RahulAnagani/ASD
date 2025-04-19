import "../Pages/Login.css"
type FormProps = {
    submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
};

const Form: React.FC<FormProps> = ({ children, submitHandler }) => {
    return (
        <form
            onSubmit={submitHandler} 
            className="bg-white flex normal expand flex-col justify-center items-center h-[60%] w-[60%] normal expand rounded pt-5 gap-3 relative"
        >
            {children}
        </form>
    );
};

export default Form;
