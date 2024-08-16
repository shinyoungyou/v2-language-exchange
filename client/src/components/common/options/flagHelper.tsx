import { Flag, FlagNameValues } from "semantic-ui-react";

export const flagHelper = (countryCode: string) => {
  switch (countryCode) {
    case 'en':
      return 'gb';
    case 'ar':
      return 'eg';
    case 'zh':
      return 'cn';
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'hi':
      return 'in';
    case 'ga':
      return 'ie';
    case 'it':
      return 'it';
    case 'ja':
      return 'jp';
    case 'ko':
      return 'kr';
    case 'pt':
      return 'br';
    case 'ru':
      return 'ru';
    case 'es':
      return 'es';
    default:
      break;
  }
}

interface NativeFlagProps {
  native: string;
}

export function NativeFlag ({native}: NativeFlagProps) {
  return (
    <Flag name={flagHelper(native) as FlagNameValues} />
  )
}

interface LearnFlagProps {
  learn: string;
}

export function LearnFlag ({learn}: LearnFlagProps) {
  return (
    <Flag name={flagHelper(learn) as FlagNameValues} />
  )
}