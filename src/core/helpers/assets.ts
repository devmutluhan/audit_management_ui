import { illustrationsSet } from "@/layouts/default-layout/config/helper";
import { useThemeStore } from "@/stores/theme";
import { userInfo } from "./localStorageManagement";
import { GenderEnum } from "@/models/custom/EnumTypes";

export const getIllustrationsPath = (illustrationName: string): string => {
  const extension = illustrationName.substring(
    illustrationName.lastIndexOf("."),
    illustrationName.length
  );
  const illustration =
    useThemeStore().mode == "dark"
      ? `${illustrationName.substring(
        0,
        illustrationName.lastIndexOf(".")
      )}-dark`
      : illustrationName.substring(0, illustrationName.lastIndexOf("."));
  return (
    import.meta.env.BASE_URL +
    `media/illustrations/${illustrationsSet.value}/${illustration}${extension}`
  );
};

// Web projesinde kayıtlı olan statik fotoları getirir.
export const getAssetPath = (path: string): string => {
  return import.meta.env.BASE_URL + path;
};

// Database e kayıtlı olan belgeleri getirir
export const getFileUrl = (fileUrl: string): string => {
  const baseUrl = "https://api.megabyte.com.tr/"
  return baseUrl + fileUrl;
}

// Kullanıcının profil fotoğrafı varsa onu getirir. Yoksa avatarsdaki fotolardan getirir.
export const getGeneralProfilePhoto = (justIcon?: boolean): string => {
  if (userInfo.value.employeeDetail.avatarUrl && !justIcon) {
    return getFileUrl(userInfo.value.employeeDetail.avatarUrl)
  } else {
    if (userInfo.value.employeeDetail.gender == GenderEnum.Male) {
      return getAssetPath('media/avatars/not-photo-man.svg');
    } else if (userInfo.value.employeeDetail.gender == GenderEnum.Female) {
      return getAssetPath('media/avatars/not-photo-women.svg');
    } else {
      return getAssetPath('media/avatars/not-photo.svg');
    }
  }
}