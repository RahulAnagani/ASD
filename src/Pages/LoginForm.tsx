import React from "react";
import Input from "./Input";

interface LoginFormProps {
  credentials: {
    userName: string;
    password: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: {
    is: boolean;
    msg: string;
  };
}

const LoginForm: React.FC<LoginFormProps> = ({
  credentials,
  handleInputChange,
  handleSubmit,
  error,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Username"
          name="userName"
          type="text"
          value={credentials.userName}
          onChange={handleInputChange}
          placeholder="Enter your username"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-500 hover:text-blue-700 transition-colors">
            Forgot password?
          </a>
        </div>
      </div>
      
      {error.is && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error.msg}</p>
        </div>
      )}
      
      <div>
        <button
          type="submit"
          className="group relative flex w-full justify-center rounded-md bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default LoginForm;