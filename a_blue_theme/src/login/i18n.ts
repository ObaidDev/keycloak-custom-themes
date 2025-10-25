//https://docs.keycloakify.dev/documentation/v11/faq-and-help/migration-guides/v10-greater-than-v11#changes-to-the-i18n-system
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

const { useI18n, ofTypeI18n } = i18nBuilder.withThemeName<ThemeName>().build();

//export type I18n = typeof ofTypeI18n;

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
