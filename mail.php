<?php
$postData = $uploadedFile = $statusMsg = '';
$msgClass = 'errordiv';
    // Get the submitted form data
    $postData = file_get_contents('php://input');
    $dataFromPost = json_decode($postData, true);
    $body = $dataFromPost['body'];
    
    // Check whether submitted data is not email.php
    
    
        $uploadStatus = 1;
        
        // Recipient
        $toEmail = 'info@cgs-logistics.ru';
        $toEmail1 = 'pavellled@gmail.com';
        $toEmail2 = 's.bogatyuk@gmail.com';
        $toEmail3 = 'gyangicher@gmail.com';
        $toEmail4 = 'info@podvizhnoisostav.ru';

        // Sender
        $from = 'info@podvizhnoisostav.ru';
        $fromName = 'Подвижной состав';
        
        // Subject
        $emailSubject = 'Новая заявка';
        
        // Header for sender info
        $headers = "From: $fromName"." <".$from.">";
                // Set content-type header for sending HTML email
        $headers .= "\r\n". "MIME-Version: 1.0";
        $headers .= "\r\n". "Content-type:text/html;charset=UTF-8";
        
        // Send email
        $mail = mail($toEmail, $emailSubject, $body, $headers);    
        $mail = mail($toEmail1, $emailSubject, $body, $headers);    
        $mail = mail($toEmail2, $emailSubject, $body, $headers);    
        $mail = mail($toEmail3, $emailSubject, $body, $headers);   
        $mail = mail($toEmail4, $emailSubject, $body, $headers);    
  

        // If mail sent
        if($mail){
            $statusMsg = 'Your contact request has been submitted successfully !';
            $msgClass = 'succdiv';
            
            $postData = '';
        }else{
            $statusMsg = 'Your contact request submission failed, please try again.';
        }
?>
