export const convertToUserResponse = (data: any): any => {
    const userInfo = {
        avatar: data.avatar ?? '',
        createdAt: data.createdAt,
        email: data.email,
        id: data.id,
        profileId: data.profileId,
        role: data.role,
        status: data.status,
        authorizationType: 'Bearer',
        updatedAt: data.updatedAt,
        username: data.username,
    } as any
    return userInfo
}
