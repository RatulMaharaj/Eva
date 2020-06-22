import { 
    faFolder, 
    faFileWord,
    faFileExcel,
    faFilePowerpoint,
    faFilePdf,
    faFileCsv,
    faFileArchive,
    faFileAlt,
    faFileCode,
    faFileImage,
    faFileVideo,
    faPlayCircle,
    faBook,
    faFile
} from '@fortawesome/free-solid-svg-icons';


const TYPE_MAP = {
    'file-word': ['doc','docx','docm'],
    'file-excel': ['xls','xlsx','xlsm','xlsb'],
    'file-powerpoint': ['ppt', 'pptx', 'pptm'],
    'file-pdf': ['pdf'],
    'file-csv': ['csv'],
    'file-archive': ['zip','7z','rar','gz','iso'],
    'file-alt': ['txt'],
    'file-code': ['py','css', 'js', 'ipynb'],
    'file-image': ['jpg', 'gif', 'png', 'bmp', 'webp'],
    'file-video': ['avi','mp4', 'm4v'],
    'file-play': ['exe'],
    'file-book': ['epub', 'mobi', 'azw'],
}

const FA_MAP = {
    'file-word': faFileWord,
    'file-excel': faFileExcel,
    'file-powerpoint': faFilePowerpoint,
    'file-pdf': faFilePdf,
    'file-csv': faFileCsv,
    'file-archive': faFileArchive,
    'file-alt': faFileAlt,
    'file-code': faFileCode,
    'file-image': faFileImage,
    'file-video': faFileVideo,
    'file-play': faPlayCircle,
    'file': faFile,
    'file-book': faBook,
}

const EXT_MAP = get_ext_map(TYPE_MAP)

function get_ext_map(typeMap) {
    const map = {}
    for (const [className, extensions] of Object.entries(typeMap)) {
        for (const ext of extensions) {
            map[ext] = className
        }
    }
    return map
}

function getExt(filename) {
    return filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();    
}

function getIcon(filename) {
    const ext = getExt(filename)
    const iconString = EXT_MAP[ext] || 'file'
    const iconFa = FA_MAP[iconString]
    return iconFa
}

export default getIcon