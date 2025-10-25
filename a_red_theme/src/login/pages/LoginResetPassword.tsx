import { useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import TrackSwiftlyLogo from "../../components/ui/TrackSwiftlyLogo";
import logoGeometer from "../../assets/img/logo_geomter_500x500.png"
// import mapBackgroundImage from "../../assets/img/digital-map-with-road-network-highlights-routes-with-line-se/26aa712b-979e-4494-b7a0-457468712aca.jpg";
import mapBackgroundImage from "../../assets/img/backgrounds/red_bg.jpg";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useImageLoader } from "../../hooks/useImageLoader";
import TrackswifltyShortLogoSvg from "../../components/ui/TrackswifltyShortLogoSvg";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { isLoaded: bgLoaded } = useImageLoader(mapBackgroundImage);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, realm, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    // Block the page from rendering until the background image is fully loaded
    if (!bgLoaded) {
        return <LoadingSpinner message="Loading password reset..." />;
    }

    const infoMessage = realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction");

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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-gray-900/30"></div>
                
                {/* Logo positioned at bottom left */}
                <div className="absolute bottom-8 left-8 z-10">
                    <TrackSwiftlyLogo />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-8 right-8 z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
            
            {/* Right Column - Password Reset Form Section */}
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
                            {msgStr("emailForgotTitle")}
                        </h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {infoMessage}
                        </p>
                    </div>

                    {/* Password Reset Form */}
                    <div className="space-y-6">
                        <form
                            id="kc-reset-password-form"
                            onSubmit={() => {
                                setIsSubmitDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                            className="space-y-5"
                        >
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
                                    type="text"
                                    id="username"
                                    name="username"
                                    autoFocus
                                    defaultValue={auth.attemptedUsername ?? ""}
                                    aria-invalid={messagesPerField.existsError("username")}
                                    placeholder={realm.loginWithEmailAllowed ? "Enter your email address" : "Enter your username"}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                />
                                {messagesPerField.existsError("username") && (
                                    <div
                                        className="text-sm text-red-600 mt-1"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("username"))
                                        }}
                                    />
                                )}
                            </div>

                            <div className="space-y-4 pt-2">
                                <Button 
                                    disabled={isSubmitDisabled} 
                                    type="submit" 
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                >
                                    {msgStr("doSubmit")}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Back to Login Link */}
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Remember your password?{" "}
                            <a 
                                href={url.loginUrl}
                                className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-2"
                            >
                                {msgStr("backToLogin")}
                            </a>
                        </span>
                    </div>

                    {/* Terms and Privacy - matching the login design */}
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