import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserSettings {
    notifications: boolean;
    appearance: string;
    privacy: string;
}
export interface PhotoMetadata {
    id: bigint;
    owner: Principal;
    timestamp: bigint;
    blobId: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePhoto(photoId: bigint): Promise<boolean>;
    getBlob(blobId: string): Promise<Uint8Array | null>;
    getCallerMomentsPhotos(): Promise<Array<PhotoMetadata>>;
    getCallerSettings(): Promise<UserSettings | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserMomentsPhotos(user: Principal): Promise<Array<PhotoMetadata>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerSettings(settings: UserSettings): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    storePhoto(photoBlob: Uint8Array): Promise<string>;
}
