const Footer = () => {
    return (
      <footer className="bg-gray-900  text-white py-10 mt-10">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center lg:items-start">
            <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent from-green-400 to-blue-500 mb-3">BookSwap</h1>
            <p className="text-lg text-gray-300 text-center lg:text-left max-w-md">
              A platform where readers and book lovers can exchange books, share reviews, and discover new genres from a global community.
            </p>
          </div>
  
          <div className="flex flex-col items-center lg:items-start space-y-3">
            <h3 className="text-lg font-semibold text-gray-400">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" className="text-gray-300 hover:text-green-400 transition-all">Home</a>
              <a href="/about" className="text-gray-300 hover:text-green-400 transition-all">About</a>
              <a href="/contact" className="text-gray-300 hover:text-green-400 transition-all">Contact</a>
              <a href="/privacy-policy" className="text-gray-300 hover:text-green-400 transition-all">Privacy Policy</a>
            </div>
          </div>
  
          <div className="flex flex-col items-center lg:items-start space-y-3">
            <h3 className="text-lg font-semibold text-gray-400">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-all">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600 transition-all">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition-all">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-700 transition-all">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>
  
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BookSwap. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  