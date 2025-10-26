import { useState, useEffect } from "react";
import { z } from "zod";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { checkboxVariants } from "../../components/ui/checkbox";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import TrackSwiftlyLogo from "../../components/ui/TrackSwiftlyLogo";
import logoGeometer from "../../assets/img/logo_geomter_500x500.png"
import mapBackgroundImage from "../../assets/img/earth.jpg";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useImageLoader } from "../../hooks/useImageLoader";
import TrackswifltyShortLogoSvg from "../../components/ui/TrackswifltyShortLogoSvg";

// Zod schema for password validation
const passwordSchema = z.string()
    .min(8, "At least 8 characters")
    .regex(/[0-9]/, "At least 1 number")
    .regex(/[a-z]/, "At least 1 lowercase letter")
    .regex(/[A-Z]/, "At least 1 uppercase letter");

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

interface PasswordValidation {
    hasMinLength: boolean;
    hasNumber: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
}

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey, termsAcceptanceRequired } = kcContext;
    const { msg, msgStr } = i18n;

    // Get initial values from URL parameters or form data if available
    const getInitialValue = (fieldName: string): string => {
        // Check if there's a value in the URL search params (for form resubmission cases)
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const value = urlParams.get(fieldName);
            if (value) return value;
        }
        
        // Check if the value exists in messagesPerField (Keycloak may pass values back on validation errors)
        // This is a fallback - you might need to adjust based on your Keycloak setup
        return "";
    };

    const [formData, setFormData] = useState({
        firstName: getInitialValue("firstName"),
        lastName: getInitialValue("lastName"),
        username: getInitialValue("username"),
        email: getInitialValue("email"),
        password: "",
        confirmPassword: ""
    });

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
        hasMinLength: false,
        hasNumber: false,
        hasLowercase: false,
        hasUppercase: false
    });
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    
    const { isLoaded: bgLoaded } = useImageLoader(mapBackgroundImage);

    // Real-time password validation
    useEffect(() => {
        const validation = {
            hasMinLength: formData.password.length >= 8,
            hasNumber: /[0-9]/.test(formData.password),
            hasLowercase: /[a-z]/.test(formData.password),
            hasUppercase: /[A-Z]/.test(formData.password)
        };
        setPasswordValidation(validation);
    }, [formData.password]);

    // Real-time form validation
    useEffect(() => {
        try {
            registerSchema.parse(formData);
            setValidationErrors({});
            setIsFormSubmittable(true);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: ValidationErrors = {};
                // Uncomment these lines if you want to show validation errors in real-time
                // error.errors.forEach((err) => {
                //     if (err.path.length > 0) {
                //         const field = err.path[0] as keyof ValidationErrors;
                //         errors[field] = err.message;
                //     }
                // });
                setValidationErrors(errors);
            }
            setIsFormSubmittable(false);
        }
    }, [formData]);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Block the registration page from rendering until the background image is fully loaded
    if (!bgLoaded) {
        return <LoadingSpinner message="Setting up your registration..." />;
    }

    const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
        <div className="flex items-center space-x-2 text-sm">
            {isValid ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            )}
            <span className={isValid ? "text-green-600" : "text-gray-500"}>{text}</span>
        </div>
    );

    return (
        <div className="min-h-screen flex">
            {/* Left Column - Hero Image Section */}
            <div className="hidden lg:flex lg:w-1/2"> {/* Added padding wrapper */}
                <div 
                    className="w-full relative bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${mapBackgroundImage})`
                    }}
                >
                    
                </div>
            </div>
            
            {/* Right Column - Registration Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-sm space-y-8">
                    {/* Logo for mobile/small screens */}
                    <div className="flex justify-center lg:hidden">
                        <img 
                            src={logoGeometer}
                            alt="Geometer Logo"
                            className="h-12 w-auto"
                        />
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-6">
                            <TrackswifltyShortLogoSvg/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create your free account
                        </h1>
                        <p className="text-gray-600">
                        Smarter tracking, sharper insights TrackSwiftly delivers total fleet control.
                        </p>

                    </div>

                    {/* Registration Form */}
                    <form 
                        id="kc-register-form" 
                        className="space-y-5" 
                        action={url.registrationAction} 
                        method="post"
                    >
                        {/* First Name and Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="First Name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                />
                                {(validationErrors.firstName || messagesPerField.existsError("firstName")) && (
                                    <p className="text-sm text-red-600">
                                        {validationErrors.firstName || messagesPerField.get("firstName")}
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                />
                                {(validationErrors.lastName || messagesPerField.existsError("lastName")) && (
                                    <p className="text-sm text-red-600">
                                        {validationErrors.lastName || messagesPerField.get("lastName")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Username and Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    placeholder="Username"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                />
                                {(validationErrors.username || messagesPerField.existsError("username")) && (
                                    <p className="text-sm text-red-600">
                                        {validationErrors.username || messagesPerField.get("username")}
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                />
                                {(validationErrors.email || messagesPerField.existsError("email")) && (
                                    <p className="text-sm text-red-600">
                                        {validationErrors.email || messagesPerField.get("email")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <svg className={`w-5 h-5 text-gray-400 hover:text-gray-600 ${showPassword ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg className={`w-5 h-5 text-gray-400 hover:text-gray-600 ${showPassword ? '' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563 3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m6-3a9.97 9.97 0 011.563 3.029m-8.626 8.626L21 21" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Password validation indicators */}
                            <div className="mt-2 space-y-1">
                                <ValidationItem isValid={passwordValidation.hasMinLength} text="At least 8 characters" />
                                <ValidationItem isValid={passwordValidation.hasNumber} text="At least 1 number" />
                                <ValidationItem isValid={passwordValidation.hasLowercase} text="At least 1 lowercase letter" />
                                <ValidationItem isValid={passwordValidation.hasUppercase} text="At least 1 uppercase letter" />
                            </div>
                            {(validationErrors.password || messagesPerField.existsError("password")) && (
                                <p className="text-sm text-red-600">
                                    {validationErrors.password || messagesPerField.get("password")}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        {doMakeUserConfirmPassword && (
                            <div className="space-y-2">
                                <Label htmlFor="password-confirm" className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password-confirm"
                                        name="password-confirm"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        placeholder="Confirm Password"
                                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <svg className={`w-5 h-5 text-gray-400 hover:text-gray-600 ${showConfirmPassword ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <svg className={`w-5 h-5 text-gray-400 hover:text-gray-600 ${showConfirmPassword ? '' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563 3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m6-3a9.97 9.97 0 011.563 3.029m-8.626 8.626L21 21" />
                                        </svg>
                                    </button>
                                </div>
                                {(validationErrors.confirmPassword || messagesPerField.existsError("password-confirm")) && (
                                    <p className="text-sm text-red-600">
                                        {validationErrors.confirmPassword || messagesPerField.get("password-confirm")}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Terms Acceptance */}
                        {termsAcceptanceRequired && (
                            <TermsAcceptance
                                i18n={i18n}
                                kcClsx={kcClsx}
                                messagesPerField={messagesPerField}
                                areTermsAccepted={areTermsAccepted}
                                onAreTermsAcceptedValueChange={setAreTermsAccepted}
                            />
                        )}

                        {/* reCAPTCHA */}
                        {recaptchaRequired && (
                            <div className="form-group">
                                <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey}></div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="space-y-4 pt-2">
                            <Button
                                disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                                type="submit"
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            >
                                {msgStr("doRegister")}
                            </Button>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <a 
                                    href={url.loginUrl} 
                                    className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
                                >
                                    Sign in
                                </a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, kcClsx, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;
    const { msg } = i18n;

    return (
        <div className="space-y-4">
            <div>
                <div className="text-gray-900 font-medium mb-2">{msg("termsTitle")}</div>
                <div id="kc-registration-terms-text" className="text-gray-600 text-sm">
                    {msg("termsText")}
                </div>
            </div>
            
            <div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className={checkboxVariants({})}
                        checked={areTermsAccepted}
                        onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                    />
                    <label htmlFor="termsAccepted" className="text-sm font-medium text-gray-700">
                        {msg("acceptTerms")}
                    </label>
                </div>
                {messagesPerField.existsError("termsAccepted") && (
                    <div className="mt-2">
                        <span
                            id="input-error-terms-accepted"
                            className="text-red-600 text-sm"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("termsAccepted"))
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}