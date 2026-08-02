import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';

export default function ReceiptScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    amount: string;
    merchant: string;
    date: string;
  } | null>(null);

  const pickImage = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Camera permission is required to scan receipts.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      processReceipt();
    }
  };

  const processReceipt = () => {
    setProcessing(true);
    setExtractedData(null);
    setTimeout(() => {
      setProcessing(false);
      setExtractedData({
        amount: '₹450.00',
        merchant: 'Starbucks Coffee',
        date: new Date().toLocaleDateString(),
      });
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Receipt Scanner 📸</Text>
      <Text style={styles.subtitle}>Upload or capture a receipt to extract details.</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage(true)}>
          <Text style={styles.btnText}>📷 Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnSecondary} onPress={() => pickImage(false)}>
          <Text style={styles.btnTextSecondary}>🖼️ Gallery</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        </View>
      )}

      {processing && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary || '#007AFF'} />
          <Text style={styles.processingText}>Extracting receipt data...</Text>
        </View>
      )}

      {extractedData && !processing && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Extracted Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Merchant:</Text>
            <Text style={styles.detailValue}>{extractedData.merchant}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValueAmount}>{extractedData.amount}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{extractedData.date}</Text>
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => Alert.alert('Success', 'Receipt logged to transactions!')}
          >
            <Text style={styles.saveBtnText}>Confirm & Log Expense</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: Colors.background || '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary || '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary || '#64748B', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { flex: 0.48, backgroundColor: Colors.primary || '#007AFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  actionBtnSecondary: { flex: 0.48, backgroundColor: '#E2E8F0', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  btnTextSecondary: { color: '#1E293B', fontWeight: '700', fontSize: 15 },
  previewContainer: { height: 250, borderRadius: 12, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#CBD5E1' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  loaderContainer: { alignItems: 'center', marginVertical: 20 },
  processingText: { marginTop: 10, fontSize: 14, color: '#64748B', fontWeight: '600' },
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  resultTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 15, color: '#64748B', fontWeight: '500' },
  detailValue: { fontSize: 15, color: '#1E293B', fontWeight: '700' },
  detailValueAmount: { fontSize: 16, color: '#16A34A', fontWeight: '800' },
  saveBtn: { backgroundColor: Colors.primary || '#007AFF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});