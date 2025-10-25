import { useState, useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { checkboxVariants } from "../../components/ui/checkbox";
import { Separator } from "../../components/ui/separator";
import { PasswordWrapper } from "../../components/ui/PasswordWrapper";
import SocialProviders from "../../components/ui/SocialProviders";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import TrackSwiftlyLogo from "../../components/ui/TrackSwiftlyLogo";
import MapBackground from "../../components/ui/MapBackground";
import logoGeometer from "../../assets/img/logo_geomter_500x500.png"
// import mapBackgroundImage from "../../assets/img/digital-map-with-road-network-highlights-routes-with-line-se/26aa712b-979e-4494-b7a0-457468712aca.jpg";
import mapBackgroundImage from "../../assets/img/backgrounds/red_bg.jpg";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useImageLoader } from "../../hooks/useImageLoader";
import TrackswifltyShortLogoSvg from "../../components/ui/TrackswifltyShortLogoSvg";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const [hoveredArea, setHoveredArea] = useState<string | null>(null);
    const { isLoaded: bgLoaded } = useImageLoader(mapBackgroundImage);

    const { kcContext, i18n, doUseDefaultCss, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const headerNode = msg("loginAccountTitle");
    const displayInfo = realm.password && realm.registrationAllowed && !registrationDisabled;
    const displayMessage = !messagesPerField.existsError("username", "password");
    
    // Block the login page from rendering until the background image is fully loaded
    if (!bgLoaded) {
        return <LoadingSpinner message="Loading your secure login..." />;
    }

    const infoNode = (
        <div className="text-center mt-8">
            <span className="text-sm text-gray-600">
                {msgStr("noAccount")}{" "}
                <a 
                    tabIndex={8} 
                    href={url.registrationUrl} 
                    className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
                >
                    {msgStr("doRegister")}
                </a>
            </span>
        </div>
    );
    
    const socialProvidersNode = social?.providers && social.providers.length > 0 ? (
        <div className="space-y-4">
            <SocialProviders social={social} kcClsx={kcClsx} clsx={clsx} msg={msg} realm={realm} />
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">
                        {msg("identity-provider-login-label") || "or"}
                    </span>
                </div>
            </div>
        </div>
    ) : null;

    const formNode = (
        <div className="space-y-6">
            {realm.password && (
                <form
                    id="kc-form-login"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                    className="space-y-5"
                >
                    {!usernameHidden && (
                        <div className="space-y-2">
                            <Label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                {!realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                        ? msg("usernameOrEmail")
                                        : msg("email")}
                            </Label>
                            <Input
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                autoComplete="username"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                                placeholder="Enter email address"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                            />
                            {messagesPerField.existsError("username", "password") && (
                                <div
                                    className="text-sm text-red-600 mt-1"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                    }}
                                />
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                {msg("password")}
                            </Label>
                            {realm.resetPasswordAllowed && (
                                <a 
                                    tabIndex={6} 
                                    href={url.loginResetCredentialsUrl}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2"
                                >
                                    {msgStr("doForgotPassword")}
                                </a>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                tabIndex={3}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const input = document.getElementById('password') as HTMLInputElement;
                                    const button = e.currentTarget;
                                    const eyeIcon = button.querySelector('.eye-icon');
                                    const eyeOffIcon = button.querySelector('.eye-off-icon');
                                    
                                    if (input.type === 'password') {
                                        input.type = 'text';
                                        eyeIcon?.classList.add('hidden');
                                        eyeOffIcon?.classList.remove('hidden');
                                    } else {
                                        input.type = 'password';
                                        eyeIcon?.classList.remove('hidden');
                                        eyeOffIcon?.classList.add('hidden');
                                    }
                                }}
                            >

                                <svg className="eye-icon w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <svg className="eye-off-icon hidden w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                    <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                            </button>
                        </div>
                        {usernameHidden && messagesPerField.existsError("username", "password") && (
                            <div
                                className="text-sm text-red-600 mt-1"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                }}
                            />
                        )}
                    </div>

                    {realm.rememberMe && !usernameHidden && (
                        <div className="flex items-center space-x-2">
                            <input
                                tabIndex={5}
                                id="rememberMe"
                                className={clsx(checkboxVariants({}), "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500")}
                                name="rememberMe"
                                type="checkbox"
                                defaultChecked={!!login.rememberMe}
                            />
                            <Label 
                                htmlFor="rememberMe" 
                                className="text-sm text-gray-700 cursor-pointer"
                            >
                                {msgStr("rememberMe")}
                            </Label>
                        </div>
                    )}

                    <div className="space-y-4 pt-2">
                        <Input 
                            type="hidden" 
                            id="id-hidden-input" 
                            name="credentialId" 
                            value={auth.selectedCredential} 
                        />
                        <Button 
                            tabIndex={7} 
                            disabled={isLoginButtonDisabled} 
                            type="submit" 
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                            {msgStr("doLogIn")}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );

    // Modern split-screen layout inspired by the target design
    return (
        <div className="min-h-screen flex">
            {/* Left Column - Hero Image Section */}
            <div 
                className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${mapBackgroundImage})`
                }}
            >
                {/* Gradient overlay for better contrast */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-gray-900/30"></div> */}
                
                {/* Logo positioned at bottom left */}
                <div className="absolute bottom-8 left-8 z-10">
                    <TrackSwiftlyLogo />
                </div>

                {/* Optional: Add some decorative elements */}
                <div className="absolute top-8 right-8 z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
            
            {/* Right Column - Login Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
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
                            Welcome back
                        </h1>
                        <p className="text-gray-600">
                            Log in to your account
                        </p>
                    </div>
                    
                    {/* Social Providers */}
                    {socialProvidersNode}
                    
                    {/* Login Form */}
                    {formNode}
                    
                    {/* Registration Link */}
                    {displayInfo && infoNode}

                    {/* Terms and Privacy - matching the target design */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you agree to our{" "}
                            <a href="#" className="underline hover:text-gray-700">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}