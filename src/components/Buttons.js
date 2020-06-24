import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useClipboard from "react-use-clipboard";
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

export function CopyButton({ text, className = "open-button", icon = faCopy }) {
    const [isCopied, copy] = useClipboard(text);
    return (<button className={className} onClick={copy}>
        <FontAwesomeIcon icon={icon} />
    </button>);
}
export function OpenButton({ path: location, className = "open-button", icon = faExternalLinkAlt }) {
    return <button className={className} onClick={() => fetch(`/api/open?path=${location}`)}>
        <FontAwesomeIcon icon={icon} />
    </button>;
}
