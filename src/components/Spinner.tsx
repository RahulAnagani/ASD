const Spinner = ({ className = "" }: { className?: string }) => {
    return (
      <div className={`spinner ${className}`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  };
  
  export default Spinner;
  