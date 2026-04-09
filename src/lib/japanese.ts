const romajiToHiraganaMap: { [key: string]: string } = {
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'he', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を', 'nn': 'ん',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'po',
    'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
    'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
    'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'cho',
    'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
    'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
    'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
    'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
    'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
    'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'jo',
    'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
    'pya': 'ぴゃ', 'pyu': 'pyu', 'pyo': 'pyo',
    'tsa': 'つぁ', 'tsi': 'つぃ', 'tse': 'つぇ', 'tso': 'つぉ',
};

/**
 * A more robust Romaji to Hiragana converter for real-time typing.
 */
export function toHiragana(text: string): string {
    let result = '';
    let i = 0;
    const lowerText = text.toLowerCase();

    while (i < lowerText.length) {
        let found = false;

        // Try 3 characters
        if (i + 2 < lowerText.length) {
            const three = lowerText.substring(i, i + 3);
            if (romajiToHiraganaMap[three]) {
                result += romajiToHiraganaMap[three];
                i += 3;
                found = true;
            }
        }

        // Try 2 characters
        if (!found && i + 1 < lowerText.length) {
            const two = lowerText.substring(i, i + 2);
            if (romajiToHiraganaMap[two]) {
                result += romajiToHiraganaMap[two];
                i += 2;
                found = true;
            } else if (two[0] === two[1] && two[0] !== 'n') {
                // Double consonant (っ)
                result += 'っ';
                i += 1;
                found = true;
            } else if (two[0] === 'n' && !['a', 'i', 'u', 'e', 'o', 'y'].includes(two[1])) {
                // 'n' followed by a consonant (ex: 'nk') -> 'んk'
                result += 'ん';
                i += 1;
                found = true;
            }
        }

        // Try 1 character
        if (!found) {
            const one = lowerText[i];
            const nextOne = lowerText[i + 1];

            if (one === 'n') {
                if (nextOne === ' ') {
                    result += 'ん ';
                    i += 2;
                } else if (!nextOne) {
                    // Last character 'n' stays as 'n' until next char or space
                    result += 'n';
                    i += 1;
                } else {
                    // Should be handled by 2-char logic if it was n+consonant
                    result += 'n';
                    i += 1;
                }
                found = true;
            } else if (romajiToHiraganaMap[one]) {
                result += romajiToHiraganaMap[one];
                i += 1;
                found = true;
            } else {
                result += text[i];
                i += 1;
            }
        }
    }
    return result;
}
