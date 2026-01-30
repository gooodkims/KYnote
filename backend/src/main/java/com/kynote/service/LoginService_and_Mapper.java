// 1. LoginMapper.java (Mapper Interface)
// 폴더 위치: src/main/java/com/kynote/mapper/LoginMapper.java
package com.kynote.mapper;

import com.kynote.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginMapper {
    UserDTO findByUserId(String userId);
}

// <!-- slide -->

// 2. LoginService.java (Service Class)
// 폴더 위치: src/main/java/com/kynote/service/LoginService.java
package com.kynote.service;

import com.kynote.mapper.LoginMapper;
import com.kynote.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private LoginMapper loginMapper;

    /**
     * VB6의 cmdConfirm_Click 내 인증 로직을 서비스 레이어로 이식
     * @param userId 입력받은 ID
     * @param password 입력받은 패스워드
     * @return 인증 성공 여부 및 사용자 정보
     */
    public UserDTO authenticate(String userId, String password) {
        UserDTO user = loginMapper.findByUserId(userId);
        
        if (user != null && user.getPassword().equals(password)) {
            // 비밀번호 일치 (실제로는 PasswordEncoder 등을 사용하여 암호화 비교 권장)
            return user;
        }
        
        return null; // 인증 실패
    }
}
