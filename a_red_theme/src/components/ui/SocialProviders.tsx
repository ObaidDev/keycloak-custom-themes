import React from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

// Import icons from lucide-react
import { 
    Github, 
    Facebook, 
    Twitter, 
    Linkedin, 
    Mail, 
    Apple, 
    Gitlab, 
    Instagram,
    Chrome,
    MessageCircle
} from "lucide-react";

export interface SocialProvidersProps {
    social:
        | {
              providers?: Array<{
                  alias: string;
                  loginUrl: string;
                  displayName: string;
                  iconClasses?: string;
              }>;
          }
        | undefined;
    kcClsx: (...args: any[]) => string;
    clsx: (...args: any[]) => string;
    msg: any;
    realm: {
        password: boolean;
    };
}


const getSocialIcon = (alias : any) => {
    const lowerAlias = alias.toLowerCase();
    
    // Map of social providers to their respective icons and brand colors
    const providerIcons = {
      github: { Icon: Github, color: "#24292e" },
      google: { Icon: Chrome, color: "#DB4437" },
      facebook: { Icon: Facebook, color: "#1877F2" },
      twitter: { Icon: Twitter, color: "#1DA1F2" },
      linkedin: { Icon: Linkedin, color: "#0A66C2" },
      apple: { Icon: Apple, color: "#000000" },
      gitlab: { Icon: Gitlab, color: "#FC6D26" },
      instagram: { Icon: Instagram, color: "#E4405F" },
      discord: { Icon: MessageCircle, color: "#5865F2" },
      // Add more providers as needed
    };
  
    // Find the matching provider or return a default
    for (const [provider, config] of Object.entries(providerIcons)) {
      if (lowerAlias.includes(provider)) {
        return config;
      }
    }
    
    // Default icon if no match is found
    return { Icon: Mail, color: "#6b7280" };
};

export const SocialProviders: React.FC<SocialProvidersProps> = ({
    social,
    kcClsx,
    clsx,
    msg,
    realm
}) => {
    const providers = social?.providers || [];

    return (
        realm.password &&
        providers.length > 0 && (
            <>
                {realm.password &&
                    social?.providers !== undefined &&
                    social.providers.length !== 0 && (
                        <div id="kc-social-providers" className="mt-5 space-y-7">
                            <h2 className="text-center text-lg mt-7">
                                {msg("identity-provider-login-label")}
                            </h2>
                            <div
                                className={clsx(
                                    "text-lg grid gap-2 grid-cols-1", // Apply a grid and gap between items
                                    social.providers.length > 1
                                        ? "md:grid-cols-2"
                                        : "grid-cols-1" // Conditional grid columns
                                )}
                            >
                                {social.providers.map((p) => {
                                    const { Icon, color } = getSocialIcon(p.alias);
                                    
                                    return (
                                        <div
                                            key={p.alias}
                                            className="items-center bg-accent w-full py-1 my-1.5 border rounded-lg px-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                                        >
                                            <a
                                                id={`social-${p.alias}`}
                                                className="flex flex-row items-center justify-center w-full py-2"
                                                type="button"
                                                href={p.loginUrl}
                                            >
                                                <Icon 
                                                    size={24} 
                                                    style={{ color }} 
                                                    className="mr-2" 
                                                />
                                                <span
                                                    className="mx-3"
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(p.displayName)
                                                    }}
                                                ></span>
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
            </>
        )
    );
};

export default SocialProviders;
// <div
//     id="kc-social-providers"
//     className={kcClsx("kcFormSocialAccountSectionClass")}
// >
//     <hr />
//     <h2>{msg("identity-provider-login-label")}</h2>
//     <ul
//         className={kcClsx(
//             "kcFormSocialAccountListClass",
//             providers.length > 3 && "kcFormSocialAccountListGridClass"
//         )}
//     >
//         {providers.map(p => (
//             <li key={p.alias}>
//                 <a
//                     id={`social-${p.alias}`}
//                     className={kcClsx(
//                         "kcFormSocialAccountListButtonClass",
//                         providers.length > 3 && "kcFormSocialAccountGridItem"
//                     )}
//                     type="button"
//                     href={p.loginUrl}
//                 >
//                     {p.iconClasses && (
//                         <i
//                             className={clsx(
//                                 kcClsx("kcCommonLogoIdP"),
//                                 p.iconClasses
//                             )}
//                             aria-hidden="true"
//                         ></i>
//                     )}
//                     <span
//                         className={clsx(
//                             kcClsx("kcFormSocialAccountNameClass"),
//                             p.iconClasses && "kc-social-icon-text"
//                         )}
//                         dangerouslySetInnerHTML={{ __html: p.displayName }}
//                     />
//                 </a>
//             </li>
//         ))}
//     </ul>
// </div>
